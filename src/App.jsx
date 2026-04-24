import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    animalType: '',
    customPrice: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const animalTypes = [
    { id: 'kambing', name: 'Kambing' },
    { id: 'domba', name: 'Domba' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }


  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi'
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Nomor telepon tidak valid'
    }
    
    
    if (!formData.animalType) {
      newErrors.animalType = 'Pilih jenis hewan kurban'
    }
    
    if (!formData.customPrice) {
      newErrors.customPrice = 'Masukkan harga hewan'
    } else if (isNaN(formData.customPrice) || Number(formData.customPrice) < 10000) {
      newErrors.customPrice = 'Minimal harga Rp 10.000'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Create WhatsApp message
    const animalName = animalTypes.find(a => a.id === formData.animalType)?.name || formData.animalType
    const message = 'Assalamualaikum Admin, izin share bukti transfer qurban bareng SKRT 2026 yaa\n\n' +
      `Pendaftaran Qurban Bareng SKRT 2026\n\n` +
      `Nama: ${formData.name}\n` +
      `No. WhatsApp: ${formData.phone}\n` +
      `Jenis Hewan: ${animalName}\n` +
      `Harga: Rp ${Number(formData.customPrice).toLocaleString('id-ID')}\n` +
      `Pesan: ${formData.message || '-'}\n\n` +
      `Mohon lampirkan bukti transfer pada chat ini ya. Terima kasih!\n\n` +
      `SKRT ! Good Vibes, Good Circle`
    
    const adminNumber = '6282122451622'
    const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
    
    setIsSubmitting(false)
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Qurban Bareng SKRT 2026</h1>
        <p>Ikut berbagi kebahagiaan di Idul Adha 1447 H</p>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nama Lengkap *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Nomor WhatsApp *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contoh: 08123456789"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>


        <div className="form-group">
          <label htmlFor="animalType">Pilih Hewan Kurban *</label>
          <div className="animal-options">
            {animalTypes.map(animal => (
              <label key={animal.id} className="animal-card">
                <input
                  type="radio"
                  name="animalType"
                  value={animal.id}
                  checked={formData.animalType === animal.id}
                  onChange={handleChange}
                />
                <div className="animal-info">
                  <span className="animal-name">{animal.name}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.animalType && <span className="error-message">{errors.animalType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="customPrice">Harga Hewan (Rp) *</label>
          <input
            type="number"
            id="customPrice"
            name="customPrice"
            value={formData.customPrice}
            onChange={handleChange}
            placeholder="Masukkan harga hewan"
            min="10000"
            className={errors.customPrice ? 'error' : ''}
          />
          {errors.customPrice && <span className="error-message">{errors.customPrice}</span>}
        </div>


        <div className="form-group">
          <label htmlFor="message">Pesan (Opsional)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tulis pesan atau doa..."
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Memproses...' : 'Kirim ke WhatsApp'}
        </button>
      </form>

      <div className="footer">
        <p>SKRT Media - Good Vibes, Good Circle</p>
        <a href="https://skrtmedia-main.vercel.app/kegiatan/qurban-2026" target="_blank" rel="noopener noreferrer">
          Kembali ke halaman kegiatan
        </a>
      </div>
    </div>
  )
}

export default App
