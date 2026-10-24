import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './src/lib/supabase';

const seed = [
  { id: 'seed-1', title: 'Set up your workspace', category: 'Personal', done: false, created_at: new Date().toISOString() },
  { id: 'seed-2', title: 'Add your first project', category: 'Study', done: false, created_at: new Date().toISOString() },
  { id: 'seed-3', title: 'Take a proper break', category: 'Life', done: true, created_at: new Date().toISOString() },
];
const categories = ['All', 'Study', 'Work', 'Personal', 'Life'];
const C = { bg: '#151923', panel: '#202634', panel2: '#242A38', text: '#F5F7FB', muted: '#9CA4B5', lime: '#C7F36B' };

function Button({ title, onPress, secondary = false }) {
  return <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={{ backgroundColor: secondary ? C.panel2 : C.lime, padding: 13, borderRadius: 14, alignItems: 'center' }}>
    <Text style={{ color: secondary ? C.text : '#172016', fontWeight: '800' }}>{title}</Text>
  </TouchableOpacity>;
}

export default function App() {
  const [tasks, setTasks] = useState(seed);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [category, setCategory] = useState('Personal');
  const [tab, setTab] = useState('Tasks');
  const [remote, setRemote] = useState(false);
  const [status, setStatus] = useState('Starting demo mode…');

  useEffect(() => { load(); }, []);

  async function load() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (!error) { setTasks(data || []); setRemote(true); setStatus('Local Supabase connected'); return; }
      setStatus('Supabase unavailable · device demo mode');
    } else setStatus('Demo mode · saved on this device');
    try {
      const saved = await AsyncStorage.getItem('localdesk.tasks');
      if (saved) setTasks(JSON.parse(saved));
      else await AsyncStorage.setItem('localdesk.tasks', JSON.stringify(seed));
    } catch {}
  }

  async function saveLocal(next) {
    setTasks(next);
    try { await AsyncStorage.setItem('localdesk.tasks', JSON.stringify(next)); } catch {}
  }

  async function addTask() {
    const title = draft.trim();
    if (!title) return Alert.alert('Task needs a name', 'Type a task first.');
    const row = { title, category, done: false };
    if (remote) {
      const { data, error } = await supabase.from('tasks').insert(row).select().single();
      if (error) return Alert.alert('Could not save task', error.message);
      setTasks(old => [data, ...old]);
    } else await saveLocal([{ ...row, id: 'local-' + Date.now(), created_at: new Date().toISOString() }, ...tasks]);
    setDraft('');
  }

  async function toggle(task) {
    const done = !task.done;
    if (remote && !String(task.id).startsWith('seed-') && !String(task.id).startsWith('local-')) {
      const { error } = await supabase.from('tasks').update({ done }).eq('id', task.id);
      if (error) return Alert.alert('Could not update task', error.message);
      setTasks(old => old.map(t => t.id === task.id ? { ...t, done } : t));
    } else await saveLocal(tasks.map(t => t.id === task.id ? { ...t, done } : t));
  }

  function remove(task) {
    Alert.alert('Delete task?', 'Remove “' + task.title + '”?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        if (remote && !String(task.id).startsWith('seed-') && !String(task.id).startsWith('local-')) {
          const { error } = await supabase.from('tasks').delete().eq('id', task.id);
          if (error) return Alert.alert('Could not delete task', error.message);
        }
        await saveLocal(tasks.filter(t => t.id !== task.id));
      }},
    ]);
  }

  const filtered = useMemo(() => tasks.filter(t => (filter === 'All' || t.category === filter) && t.title.toLowerCase().includes(search.toLowerCase())), [tasks, filter, search]);
  const completed = tasks.filter(t => t.done).length;
  const active = tasks.length - completed;

  return <SafeAreaView style={{ flex:  1, backgroundColor: C.bg }}>
    <StatusBar barStyle="light-content" backgroundColor={C.bg} />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 35 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#172016', fontSize: 21, fontWeight: '900' }}>L</Text></View>
            <View><Text style={{ color: C.text, fontSize: 22, fontWeight: '900' }}>localdesk</Text><Text style={{ color: C.muted, fontSize: 11 }}>YOUR SPACE, YOUR RULES</Text></View>
          </View>
          <Text style={{ color: C.lime, fontSize: 11, fontWeight: '800' }}>● LOCAL FIRST</Text>
        </View>

        <View style={{ marginTop: 28 }}>
          <Text style={{ color: C.muted, fontSize: 13 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
          <Text style={{ color: C.text, fontSize: 31, fontWeight: '900', marginTop: 7 }}>Make room for</Text>
          <Text style={{ color: C.lime, fontSize: 31, fontWeight: '900' }}>what matters.</Text>
          <Text style={{ color: C.muted, marginTop: 9, lineHeight: 21 }}>A tiny command center for tasks, projects, and your next move.</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 23 }}>
          <View style={{ flex: 1, backgroundColor: C.lime, borderRadius: 20, padding: 17 }}><Text style={{ color: '#36432A', fontSize: 12, fontWeight: '700' }}>IN PROGRESS</Text><Text style={{ color: '#172016', fontSize: 34, fontWeight: '900', marginTop: 7 }}>{active}</Text><Text style={{ color: '#36432A', fontSize: 12 }}>things to tackle</Text></View>
          <View style={{ flex: 1, backgroundColor: C.panel2, borderRadius: 20, padding: 17 }}><Text style={{ color: C.muted, fontSize: 12, fontWeight: '700' }}>COMPLETED</Text><Text style={{ color: C.text, fontSize: 34, fontWeight: '900', marginTop: 7 }}>{completed}</Text><Text style={{ color: C.muted, fontSize: 12 }}>nice work, human</Text></View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 24 }}>
          {['Tasks', 'Overview'].map(name => <TouchableOpacity key={name} onPress={() => setTab(name)} style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: tab === name ? '#303849' : 'transparent' }}><Text style={{ color: tab === name ? C.lime : C.muted, fontWeight: '800' }}>{name}</Text></TouchableOpacity>)}
        </View>

        {tab === 'Tasks' ? <>
          <View style={{ backgroundColor: C.panel, padding: 14, borderRadius: 19, marginTop: 12 }}>
            <Text style={{ color: C.text, fontWeight: '800', fontSize: 15, marginBottom: 11 }}>Add a task</Text>
            <TextInput value={draft} onChangeText={setDraft} placeholder="What needs doing?" placeholderTextColor="#737D91" returnKeyType="done" onSubmitEditing={addTask} style={{ color: C.text, backgroundColor: C.bg, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, marginBottom: 10 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {categories.slice(1).map(c => <TouchableOpacity key={c} onPress={() => setCategory(c)} style={{ backgroundColor: category === c ? '#3B4930' : '#2B3242', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginRight: 7 }}><Text style={{ color: category === c ? C.lime : '#B8C0CF', fontSize: 12, fontWeight: '700' }}>{c}</Text></TouchableOpacity>)}
            </ScrollView>
            <Button title="+ Create task" onPress={addTask} />
          </View>

          <TextInput value={search} onChangeText={setSearch} placeholder="Search tasks…" placeholderTextColor="#737D91" style={{ color: C.text, backgroundColor: C.panel, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 12, marginTop: 22, marginBottom: 12 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {categories.map(c => <TouchableOpacity key={c} onPress={() => setFilter(c)} style={{ backgroundColor: filter === c ? C.lime : C.panel2, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 9, marginRight: 7 }}><Text style={{ color: filter === c ? '#172016' : '#B8C0CF', fontSize: 12, fontWeight: '800' }}>{c}</Text></TouchableOpacity>)}
          </ScrollView>
          {filtered.length ? filtered.map(task => <View key={task.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.panel, padding: 14, borderRadius: 17, marginBottom: 10, gap: 12 }}>
            <TouchableOpacity onPress={() => toggle(task)} style={{ width: 26, height: 26, borderRadius: 9, borderWidth: 1.5, borderColor: task.done ? C.lime : '#687084', backgroundColor: task.done ? C.lime : 'transparent', alignItems: 'center', justifyContent: 'center' }}>{task.done ? <Text style={{ color: '#172016', fontWeight: '900' }}>✓</Text> : null}</TouchableOpacity>
            <View style={{ flex: 1 }}><Text style={{ color: task.done ? '#858C9D' : C.text, fontWeight: '700', fontSize: 15, textDecorationLine: task.done ? 'line-through' : 'none' }}>{task.title}</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>{task.category} · {task.done ? 'Completed' : 'In progress'}</Text></View>
            <TouchableOpacity onPress={() => remove(task)} style={{ padding: 6 }}><Text style={{ color: C.muted, fontSize: 18 }}>×</Text></TouchableOpacity>
          </View>) : <View style={{ padding: 25, alignItems: 'center', backgroundColor: C.panel, borderRadius: 17 }}><Text style={{ color: C.text, fontWeight: '800' }}>Nothing here. Suspiciously peaceful.</Text><Text style={{ color: C.muted, marginTop: 5 }}>Add a task above to get moving.</Text></View>}
        </> : <View style={{ marginTop: 12, gap: 12 }}>
          <View style={{ backgroundColor: C.panel, borderRadius: 18, padding: 18 }}><Text style={{ color: C.muted }}>TOTAL TASKS</Text><Text style={{ color: C.text, fontSize: 30, fontWeight: '900', marginTop: 6 }}>{tasks.length}</Text></View>
          <View style={{ backgroundColor: C.panel, borderRadius: 18, padding: 18 }}><Text style={{ color: C.muted }}>COMPLETION RATE</Text><Text style={{ color: C.lime, fontSize: 30, fontWeight: '900', marginTop: 6 }}>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</Text><View style={{ height: 7, backgroundColor: '#343B4B', borderRadius: 10, marginTop: 12, overflow: 'hidden' }}><View style={{ height: 7, width: (tasks.length ? completed / tasks.length * 100 : 0) + '%', backgroundColor: C.lime }} /></View></View>
          <View style={{ backgroundColor: C.panel, borderRadius: 18, padding: 18 }}><Text style={{ color: C.muted }}>DATA MODE</Text><Text style={{ color: C.text, fontSize: 16, fontWeight: '800', marginTop: 6 }}>{status}</Text><Text style={{ color: C.muted, marginTop: 6, lineHeight: 19 }}>Demo mode needs no account. Configure local Supabase to store tasks in PostgreSQL on your PC.</Text><Button title="Reload workspace" secondary onPress={load} /></View>
        </View>}
        <Text style={{ color: '#667084', textAlign: 'center', marginTop: 25, fontSize: 11 }}>LOCALDESK · BUILT FOR YOUR OWN LITTLE CORNER OF THE INTERNET</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
