// ============================================
// SCRIPT: Limpar Sessão Completa - MovTudo
// DESCRIÇÃO: Script para limpar completamente a sessão
//           Execute no console do navegador
// ============================================

console.log('🧹 Iniciando limpeza completa da sessão...')

// 1. Limpar localStorage
console.log('1️⃣ Limpando localStorage...')
localStorage.clear()

// 2. Limpar sessionStorage
console.log('2️⃣ Limpando sessionStorage...')
sessionStorage.clear()

// 3. Limpar cookies relacionados ao Supabase
console.log('3️⃣ Limpando cookies do Supabase...')
const cookies = document.cookie.split(';')
cookies.forEach(cookie => {
  const eqPos = cookie.indexOf('=')
  const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
  
  // Limpar cookies relacionados ao Supabase
  if (name.includes('supabase') || name.includes('sb-') || name.includes('auth')) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
  }
})

// 4. Limpar IndexedDB (se existir)
console.log('4️⃣ Limpando IndexedDB...')
if ('indexedDB' in window) {
  indexedDB.databases().then(databases => {
    databases.forEach(db => {
      if (db.name && (db.name.includes('supabase') || db.name.includes('auth'))) {
        indexedDB.deleteDatabase(db.name)
      }
    })
  }).catch(console.error)
}

// 5. Forçar logout no Supabase (se disponível)
console.log('5️⃣ Tentando logout forçado...')
if (window.supabase) {
  window.supabase.auth.signOut().then(() => {
    console.log('✅ Logout no Supabase realizado')
  }).catch(err => {
    console.log('⚠️ Supabase não disponível:', err)
  })
}

// 6. Recarregar página após 2 segundos
console.log('6️⃣ Recarregando página em 2 segundos...')
setTimeout(() => {
  window.location.reload()
}, 2000)

console.log('✅ Limpeza completa finalizada!')
console.log('🔄 A página será recarregada automaticamente...')
