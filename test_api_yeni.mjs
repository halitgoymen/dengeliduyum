import http from 'http'

const params = new URLSearchParams({
  kategori: 'Yeni Hasta Şikayetleri',
  yasGrubu: '18-65 yaş',
  hastaTipi: 'yeni'
})

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/anamnez-sorulari?' + params.toString(),
  method: 'GET'
}

const req = http.request(options, res => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => console.log(data))
})

req.on('error', error => console.error(error))
req.end()
