import bcrypt from 'bcrypt';

export async function seed(knex) {
  if (knex.client.config.client === 'better-sqlite3') await knex.raw('PRAGMA foreign_keys = OFF');
  for (const table of ['join_requests','trip_updates','weather_cache','notifications','discussion_replies','discussion_posts','expense_participants','expenses','poll_votes','poll_options','polls','suggestion_votes','suggestions','activities','itinerary_days','trip_members','packing_items','trips','users']) {
    await knex(table).del();
  }
  if (knex.client.config.client === 'better-sqlite3') await knex.raw('PRAGMA foreign_keys = ON');
  const now = new Date();
  const users = [
    ['user-joy','Joy M','demo-joy@tripforge.test','@1111111','Love to explore'],
    ['user-1','Mahmud Rana Tonmoy','demo-tonmoy@tripforge.test','tonmoy1234','Software Engineering student organizing semester break trips.'],
    ['user-2','Arafat Hossain','demo-arafat@tripforge.test','password123','Route planner and sunrise hiker.'],
    ['user-3','Nadia Karim','demo-nadia@tripforge.test','password123','Always tracks receipts and group coffee runs.'],
    ['user-4','Tariq Hasan','demo-tariq@tripforge.test','password123','Food spots, ferries, and camera gear.'],
    ['user-5','Samira Chowdhury','demo-samira@tripforge.test','password123','Checklist keeper and train timetable nerd.'],
  ];
  await knex('users').insert(await Promise.all(users.map(async ([id,name,email,password,bio]) => ({
    id,name,email,password_hash:await bcrypt.hash(password,12),phone:'',bio,university:'Daffodil International University',department:'Software Engineering',created_at:now
  }))));
  await knex('trips').insert([
    {id:'trip-1',name:"Cox's Bazar Coastline Escape",destination:"Cox's Bazar & Saint Martin's",start_date:'2026-12-18',end_date:'2026-12-21',budget_paise:960000,description:"Post-finals group trip down Marine Drive.",invite_code:'TF-COAST-402',created_by:'user-1',latitude:'21.4272',longitude:'92.0058',created_at:now},
    {id:'trip-2',name:'Sylhet Tea & Waterfall Weekend',destination:'Sylhet, Jaflong & Ratargul',start_date:'2027-01-15',end_date:'2027-01-17',budget_paise:650000,description:'Three-day winter train trip.',invite_code:'TF-SYLH-198',created_by:'user-1',latitude:'24.8949',longitude:'91.8687',created_at:now},
    {id:'trip-3',name:'Bandarban Ridge Trail',destination:'Bandarban & Boga Lake',start_date:'2027-02-05',end_date:'2027-02-07',budget_paise:980000,description:'February hill trek workspace.',invite_code:'TF-RIDGE-731',created_by:'user-joy',latitude:'22.1953',longitude:'92.2184',created_at:now},
    {id:'trip-4',name:'Sundarbans River Study Tour',destination:'Khulna & Karamjal',start_date:'2027-03-12',end_date:'2027-03-14',budget_paise:820000,description:'Department eco-tour.',invite_code:'TF-SUND-512',created_by:'user-joy',latitude:'22.4292',longitude:'89.5914',created_at:now},
    {id:'trip-5',name:'Sajek Valley Cloud Trek',destination:'Sajek, Ruilui & Konglak',start_date:'2027-03-22',end_date:'2027-03-25',budget_paise:850000,description:'Cloud canopy trek.',invite_code:'6767',created_by:'user-3',latitude:'23.3821',longitude:'92.2938',created_at:now},
  ]);
  await knex('trip_members').insert([
    {trip_id:'trip-1',user_id:'user-1',role:'Trip Creator',status:'approved',joined_at:now},{trip_id:'trip-1',user_id:'user-joy',role:'Trip Member',status:'approved',joined_at:now},{trip_id:'trip-1',user_id:'user-2',role:'Trip Member',status:'approved',joined_at:now},{trip_id:'trip-1',user_id:'user-3',role:'Trip Member',status:'approved',joined_at:now},{trip_id:'trip-1',user_id:'user-4',role:'Trip Member',status:'approved',joined_at:now},
    {trip_id:'trip-2',user_id:'user-1',role:'Trip Creator',status:'approved',joined_at:now},{trip_id:'trip-2',user_id:'user-2',role:'Trip Member',status:'approved',joined_at:now},{trip_id:'trip-2',user_id:'user-joy',role:'Trip Member',status:'approved',joined_at:now},{trip_id:'trip-2',user_id:'user-5',role:'Trip Member',status:'approved',joined_at:now},
    {trip_id:'trip-3',user_id:'user-joy',role:'Trip Creator',status:'approved',joined_at:now},{trip_id:'trip-3',user_id:'user-1',role:'Trip Member',status:'approved',joined_at:now},{trip_id:'trip-3',user_id:'user-2',role:'Trip Member',status:'approved',joined_at:now},{trip_id:'trip-3',user_id:'user-4',role:'Trip Member',status:'approved',joined_at:now},
  ]);
  await knex('join_requests').insert({id:'req-3-1',trip_id:'trip-3',user_id:'user-5',status:'pending',requested_at:now});
  for (const [tripId,start,end] of [['trip-1','2026-12-18','2026-12-21'],['trip-2','2027-01-15','2027-01-17'],['trip-3','2027-02-05','2027-02-07'],['trip-4','2027-03-12','2027-03-14'],['trip-5','2027-03-22','2027-03-25']]) {
    const count=(new Date(end)-new Date(start))/86400000+1;
    await knex('itinerary_days').insert(Array.from({length:count},(_,i)=>({id:`day-${tripId}-${i+1}`,trip_id:tripId,day_number:i+1,created_at:now})));
  }
  await knex('activities').insert([
    {id:'act-101',trip_id:'trip-1',day_number:1,title:'Morning bus arrival & hostel check-in',time:'08:30',location:'Kolatoli Beach Road',cost_paise:180000,notes:'Drop bags and grab breakfast nearby.',sort_order:0,created_by:'user-1'},
    {id:'act-102',trip_id:'trip-1',day_number:1,title:'Sunset walk along Laboni Point',time:'17:00',location:'Laboni Beach',cost_paise:35000,notes:'Tea stalls and golden hour photos.',sort_order:1,created_by:'user-2'},
    {id:'act-201',trip_id:'trip-2',day_number:1,title:'Parabat Express arrival & Zindabazar breakfast',time:'07:45',location:'Sylhet Railway Station',cost_paise:55000,notes:'Meet at platform exit.',sort_order:0,created_by:'user-2'},
  ]);
  await knex('suggestions').insert([{id:'idea-1',trip_id:'trip-1',title:'Sunrise kayak session near Patuartek',location:'Patuartek Beach',estimated_cost_paise:45000,notes:'Calm water before 8 AM.',author_id:'user-2',added_to_itinerary:false,created_at:now},{id:'idea-3',trip_id:'trip-1',title:'Chera Dwip cycling & tide walk',location:'Chera Dwip South Point',estimated_cost_paise:40000,notes:'Rent bicycles near the main bazaar.',author_id:'user-4',added_to_itinerary:true,created_at:now}]);
  await knex('suggestion_votes').insert([{suggestion_id:'idea-1',user_id:'user-1',value:1},{suggestion_id:'idea-1',user_id:'user-2',value:1},{suggestion_id:'idea-1',user_id:'user-4',value:-1},{suggestion_id:'idea-3',user_id:'user-1',value:1},{suggestion_id:'idea-3',user_id:'user-2',value:1}]);
  await knex('polls').insert([{id:'poll-1',trip_id:'trip-1',question:'Which dinner spot should we book for Night 2?',created_by:'user-1',status:'open',created_at:now},{id:'poll-2',trip_id:'trip-1',question:'Preferred transport from Dhaka to Cox’s Bazar?',created_by:'user-1',status:'closed',created_at:now}]);
  await knex('poll_options').insert([{id:'opt-1',poll_id:'poll-1',text:'Poushee Courtyard Seafood'},{id:'opt-2',poll_id:'poll-1',text:'Mermaid Beach Cafe'},{id:'opt-4',poll_id:'poll-2',text:'Overnight sleeper coach'},{id:'opt-5',poll_id:'poll-2',text:'Cox’s Bazar Express train'}]);
  await knex('poll_votes').insert([{poll_id:'poll-1',option_id:'opt-1',user_id:'user-1'},{poll_id:'poll-1',option_id:'opt-2',user_id:'user-2'}]);
  await knex('expenses').insert([{id:'exp-1',trip_id:'trip-1',title:'Sleeper coach tickets (4 seats)',amount_paise:240000,payer_id:'user-1',date:'2026-11-02'}]);
  await knex('expense_participants').insert(['user-1','user-2','user-3','user-4'].map(user_id=>({expense_id:'exp-1',user_id})));
  await knex('packing_items').insert([{id:'pack-1',trip_id:'trip-1',title:'Portable power bank (20,000 mAh)',assignee_id:'user-1',packed:true},{id:'pack-6',trip_id:'trip-1',title:'Compact travel card game',assignee_id:null,packed:false}]);
  await knex('discussion_posts').insert({id:'post-1',trip_id:'trip-1',author_id:'user-1',content:'Please upload your student ID photos before Friday.',created_at:now});
  await knex('discussion_replies').insert({id:'rep-1',post_id:'post-1',author_id:'user-3',content:'Just sent mine! Also added the ferry deposit.',created_at:now});
  await knex('notifications').insert({id:'notif-1',trip_id:'trip-1',user_id:'user-2',category:'Expense',message:'Mahmud Rana Tonmoy added "Sleeper coach tickets" to Expenses.',link:'/trips/trip-1/expenses',is_read:false,created_at:now});
}
