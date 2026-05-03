const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing supabase env vars', { supabaseUrl, supabaseKey });
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);
(async () => {
  const email = 'bugtestuser1@example.com';
  const password = 'Test1234!';
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { first_name: 'Bug', last_name: 'Tester' },
    email_confirm: true,
  });
  console.log('result', { data, error });
})();
