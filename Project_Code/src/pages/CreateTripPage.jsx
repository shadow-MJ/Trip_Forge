import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTrip } from "../api/tripsApi";
import Card from "../components/Card";
import { ArrowLeftIcon } from "../components/Icons";
import { useAuth } from "../context/useAuth";
import { isEndDateValid } from "../utils/dateUtils";
import "./CreateTripPage.css";

export default function CreateTripPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dateRangeInvalid =
    Boolean(startDate && endDate) && !isEndDateValid(startDate, endDate);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a trip name.");
      return;
    }
    if (!destination.trim()) {
      setError("Please enter a destination.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please choose both a start date and an end date.");
      return;
    }
    if (!isEndDateValid(startDate, endDate)) {
      setError("End date must be on or after the start date.");
      return;
    }
    if (budget !== "" && Number(budget) < 0) {
      setError("Budget cannot be negative.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createTrip(
        {
          name,
          destination,
          startDate,
          endDate,
          budget: budget === "" ? 0 : Number(budget),
          description,
        },
        user,
      );
      navigate(`/trips/${created.id}/overview`, { replace: true });
    } catch (err) {
      setError(err.message || "Could not create trip.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container page-section">
      <div className="tf-create-trip__wrap">
        <Link to="/dashboard" className="tf-create-trip__back">
          <ArrowLeftIcon size={15} />
          Back to trips
        </Link>

        <div className="page-header" style={{ marginBottom: "var(--space-5)" }}>
          <div>
            <h1 className="page-title">Create a new trip</h1>
            <p className="page-subtitle">
              Set the core details first. You can invite members and adjust
              plans anytime.
            </p>
          </div>
        </div>

        <Card>
          <form className="form-stack" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="trip-name" className="form-label">
                Trip name
              </label>
              <input
                id="trip-name"
                type="text"
                className="form-input"
                placeholder="e.g., Spring Break Hill Trek"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="trip-destination" className="form-label">
                Destination
              </label>
              <input
                id="trip-destination"
                type="text"
                className="form-input"
                placeholder="e.g., Sylhet & Jaflong"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="trip-start" className="form-label">
                  Start date
                </label>
                <input
                  id="trip-start"
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="trip-end" className="form-label">
                  End date
                </label>
                <input
                  id="trip-end"
                  type="date"
                  className="form-input"
                  min={startDate || undefined}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
                {dateRangeInvalid && (
                  <span className="field-error-text" role="alert">
                    End date cannot be earlier than start date.
                  </span>
                )}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="trip-budget" className="form-label">
                Estimated group budget (BDT)
              </label>
              <input
                id="trip-budget"
                type="number"
                min="0"
                step="50"
                className="form-input"
                placeholder="e.g., 7500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <span className="form-hint">
                Used to compare planned and tracked expenses across the group in
                BDT (e.g., ৳3,000–৳10,000).
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="trip-description" className="form-label">
                Description
              </label>
              <textarea
                id="trip-description"
                className="form-textarea"
                placeholder="Share a quick overview of the route, goals, or travel dates..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="tf-create-trip__actions">
              <Link to="/dashboard" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || dateRangeInvalid}
              >
                {submitting ? "Creating trip..." : "Create trip"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
