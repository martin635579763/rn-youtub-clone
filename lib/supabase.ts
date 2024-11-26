import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants';

const supabaseUrl = 'https://ghiclekvejhjuslzpjao.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaWNsZWt2ZWpoanVzbHpwamFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTUxMDQsImV4cCI6MjA0NzM5MTEwNH0.Mdk-B0N6pJVuk_PuJPzQ0a8-P7MOOFL8MaYReasOK-s'
export const supabase = createClient(supabaseUrl, supabaseKey);