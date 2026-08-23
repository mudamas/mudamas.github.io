const MUDAMAS_SUPABASE_URL='https://nzkoymhwgukbaegjrvau.supabase.co';
const MUDAMAS_SUPABASE_PUBLISHABLE_KEY='sb_publishable_d33uDgFnZO9pr_vm0InylQ_I-LYspRb';
window.mudamasSupabase=window.supabase.createClient(MUDAMAS_SUPABASE_URL,MUDAMAS_SUPABASE_PUBLISHABLE_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
});
