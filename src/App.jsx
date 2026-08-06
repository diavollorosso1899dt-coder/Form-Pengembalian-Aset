import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardList, Smartphone, FileText, CloudUpload, Image as ImageIcon, FileType, Printer, 
  RefreshCw, ArrowLeftRight, Package, Trash2, Plus, Camera, X, PenTool, CheckCircle, 
  AlertTriangle, Loader2, Search, QrCode, Building2, ShieldCheck, History, Eye, 
  Sparkles, Check, ChevronDown, Filter, Info, Copy, FileCheck
} from 'lucide-react';

// MASTER CONSTANTS
const GUDANG_LIST = [
  { name: 'Gudang Aset', address: 'Jl. Ahmad Yani No. 88, Pontianak (Pusat Aset Utama)' },
  { name: 'Gudang Logistik', address: 'Kawasan Industri Siantan, Pontianak Utara' },
  { name: 'Workshop Maintenance', address: 'Jl. Sungai Raya Dalam No. 12' },
  { name: 'Scrap Yard / Afkir', address: 'Jl. VETERAN No. 45' },
  { name: 'Lainnya', address: '' }
];

const OUTLET_LIST = [
  { name: 'Ayam Goreng Makmur Karya', address: 'Jl. Karya Baru No. 15, Pontianak' },
  { name: 'Ayam Goreng Makmur Johar', address: 'Jl. Johar No. 8, Pontianak' },
  { name: 'Bakso Tyga Sapi M Sohor', address: 'Jl. M. Sohor No. 22' },
  { name: 'Bakso Tyga Sapi Siantan', address: 'Jl. Gusti Situt Mahmud No. 101' },
  { name: 'Bakso Tyga Sapi Tanray 2', address: 'Jl. Tanjung Raya 2 No. 45' },
  { name: 'Bebek Boedjang Ayani 2', address: 'Jl. Arteri Supadio / Ayani 2' },
  { name: 'Bebek Boedjang Ketapang', address: 'Jl. Merdeka No. 88, Ketapang' },
  { name: 'Bebek Boedjang Merdeka', address: 'Jl. Merdeka Barat No. 12' },
  { name: 'Bebek Boedjang Serdam', address: 'Jl. Sungai Raya Dalam' },
  { name: 'Bebek Boedjang Siantan', address: 'Jl. Khatulistiwa No. 56' },
  { name: 'Bebek Boedjang Singkawang', address: 'Jl. Alianyang No. 99, Singkawang' },
  { name: 'Bebek Boedjang Sumatra', address: 'Jl. Sumatra No. 14' },
  { name: 'Bebek Ladjang', address: 'Jl. Gajah Mada No. 200' },
  { name: 'Ikan Bakar Muara Ketapang', address: 'Jl. R. Suprapto, Ketapang' },
  { name: 'Ikan Bakar Muara Sejahtera', address: 'Jl. Sejahtera No. 33' },
  { name: 'Ikan Bakar Muara SSA', address: 'Jl. Sutan Syahrir No. 7' },
  { name: 'Kokotuku Coffee', address: 'Jl. Reformasi Untan' },
  { name: 'Mie Ayam Muntjul Dansen', address: 'Jl. Danau Sentarum' },
  { name: 'Mie Ayam Muntjul Kuala', address: 'Jl. Kuala Dua' },
  { name: 'Mie Ayam Muntjul Patimura', address: 'Jl. Pattimura No. 18' },
  { name: 'Mie Ayam Muntjul Singkawang', address: 'Jl. Diponegoro, Singkawang' },
  { name: 'Sambal Camat Perdana', address: 'Jl. Perdana No. 8' },
  { name: 'Sambal Camat Sumatra', address: 'Jl. Sumatra No. 22' },
  { name: 'Sop Mak Garang Johar', address: 'Jl. Johar No. 10' },
  { name: 'Sop Mak Garang Mempawah', address: 'Jl. Daeng Manambon, Mempawah' },
  { name: 'Sop Mak Garang Perdana', address: 'Jl. Perdana No. 12' },
  { name: 'Sop Mak Garang Singkawang', address: 'Jl. Pasiran, Singkawang' },
  { name: 'Soto Semar Ayani 2', address: 'Jl. Arteri Supadio No. 44' },
  { name: 'Soto Semar M Sohor', address: 'Jl. M. Sohor No. 15' },
  { name: 'Warung Koyan Sejahtera', address: 'Jl. Sejahtera No. 88' },
  { name: 'Warung Koyan Sumatra', address: 'Jl. Sumatra No. 40' },
  { name: 'Warung Nini Pontianak', address: 'Jl. K.H. Ahmad Dahlan No. 2' },
  { name: 'Lainnya', address: '' }
];

const UOM_OPTIONS = [
  { group: 'Satuan Kuantitas', items: ['Unit', 'Pcs', 'Set', 'Ekor', 'Bungkus', 'Pack'] },
  { group: 'Kemasan & Tempat', items: ['Botol', 'Cup', 'Kaleng', 'Kotak', 'Dus', 'Karton', 'Roll'] },
  { group: 'Berat & Ukuran', items: ['Kg', 'Gram', 'Liter', 'Ml', 'Meter'] }
];

const CONDITION_OPTIONS = ['Layak Pakai', 'Layak Pakai Terbatas', 'Tidak Standar', 'Tidak Layak Pakai', 'Rusak Berat'];
const ACCOUNT_CATEGORIES = ['Peralatan', 'Perlengkapan Tetap'];

// 400+ MASTER ITEMS DATABASE
const MASTER_ITEMS = {
  'Peralatan': [
    { name: 'ac' }, { name: 'AC 1,5 pk' }, { name: 'AC - 1,5 PK - Daikin' }, { name: 'AC - 1,5 PK - Gree' }, { name: 'AC 2pk' }, { name: 'AC - 2 PK - Daikin' },
    { name: 'akuarium besar' }, { name: 'akuarium kecil' }, { name: 'Amplifier - DAT' }, { name: 'Aquarium Minuman' }, { name: 'Gerobak Dorong Semen - Artco' },
    { name: 'Awning sun shade' }, { name: 'baby chair' }, { name: 'Wireless Calling System - Retekess - 16 Remote' }, { name: 'benmerry besar' },
    { name: 'blender' }, { name: 'blender cooper' }, { name: 'Blender Getra' }, { name: 'Bracket tv' }, { name: 'brankas' }, { name: 'Brankas kasir' },
    { name: 'Camera Meeting' }, { name: 'cashdrawer' }, { name: 'cctv' }, { name: 'cctv smart' }, { name: 'Chopper' }, { name: 'Cooler box 35s' },
    { name: 'CPU Komputer' }, { name: 'Cupsealer Semi Automatic' }, { name: 'dandang bakso' }, { name: 'Dandang dimsum' }, { name: 'dandang kuah prasmanan' },
    { name: 'dandang mie ayam' }, { name: 'Deep Fryer ( 2 tungku )' }, { name: 'Dispenser Galon Bawah' }, { name: 'dispenser jus' }, { name: 'Printer - EPSON - L3250' },
    { name: 'Etalase bar' }, { name: 'Etalase makanan' }, { name: 'Fingerprint - Finger Spot' }, { name: 'freezer' }, { name: 'Freezer 1050L' }, { name: 'Freezer 500L' },
    { name: 'Gerobak Bakso' }, { name: 'Grease Trap - Stainles' }, { name: 'Grinder Kopi Simonelli' }, { name: 'Handphone - Realme - C33' }, { name: 'HT' },
    { name: 'Kap Lampu rotan besar' }, { name: 'Kipas angin 10in' }, { name: 'kipas angin berdiri' }, { name: 'kipas angin dinding' }, { name: 'Kipas Angin Dinding - Cosmos' },
    { name: 'kompor api seribu' }, { name: 'kompor gas 2 tungku' }, { name: 'kompor mawar' }, { name: 'kompor rinnai' }, { name: 'kulkas' }, { name: 'Kursi Bar' },
    { name: 'kursi kayu sandaran tinggi' }, { name: 'Kursi manager' }, { name: 'Kursi Sandar - Napolly' }, { name: 'laptop' }, { name: 'Laptop - Lenovo - X280' },
    { name: 'Lemari Arsip Besi' }, { name: 'Loker Besi' }, { name: 'magicom besar' }, { name: 'meja bar' }, { name: 'Meja Dapur' }, { name: 'meja kasir' },
    { name: 'Meja Lesehan Jati' }, { name: 'mesin air jetpump' }, { name: 'mesin genset' }, { name: 'Mesin Kopi Simonelli' }, { name: 'Microwave' }, { name: 'Mobil Pickup - Grandmax' },
    { name: 'Monitor Komputer' }, { name: 'neon box' }, { name: 'Panci Stokpot' }, { name: 'Payung Tenda 240cm' }, { name: 'Pemadam api (apar)' }, { name: 'Presto - Getra - 75 Liter' },
    { name: 'Printer - EPSON - L121' }, { name: 'Proyektor - EPSON' }, { name: 'Rak besi custom' }, { name: 'Showcase - Polytron' }, { name: 'Speaker BMB' }, { name: 'Speaker portable' },
    { name: 'Tab - Redmi Pad SE' }, { name: 'Tablet kasir 10in' }, { name: 'Tabung Gas BrightGas 12kg' }, { name: 'Tangki Air Stainless 2000L' }, { name: 'Tenda 3x3' }, { name: 'Trolly Datar' },
    { name: 'Under Counter Refrigerator' }, { name: 'Wastafel Stainless 2 Lubang' }
  ],
  'Perlengkapan Tetap': [
    { name: '(Jadul) Kursi Lesehan Rotan' }, { name: '(Jadul) Lampu hias gantung' }, { name: '(Jadul) Mesin ketik' }, { name: '(JADUL) Rantang' }, { name: '(Jadul) Televisi' },
    { name: 'Akrilik Menu A4' }, { name: 'Akrilik No Meja' }, { name: 'Akrilik QRIS A5' }, { name: 'Apron Barista' }, { name: 'Apron Kulit' }, { name: 'Asbak Semen' },
    { name: 'Baju Seragam Karyawan' }, { name: 'bak clear up' }, { name: 'bakul enamel' }, { name: 'baskom stainless' }, { name: 'bel kasir' }, { name: 'bill holder' },
    { name: 'botol kecap ulir' }, { name: 'box container 160L' }, { name: 'Buku Menu' }, { name: 'Cangkir Cappucino' }, { name: 'cangkir kopi batik' }, { name: 'centong kuah stainless' },
    { name: 'cobek sambal melamin' }, { name: 'dandang orchid' }, { name: 'dispenser sabun cair' }, { name: 'ember cuci tangan' }, { name: 'garpu makan' }, { name: 'gelas teh es' },
    { name: 'gelas veronika akrilik' }, { name: 'gorden lipat VIP' }, { name: 'gunting seng' }, { name: 'jam dinding BSI' }, { name: 'jaring mie ayam' }, { name: 'kain spanduk' },
    { name: 'kalkulator' }, { name: 'kanebo' }, { name: 'keranjang buah' }, { name: 'keranjang kerupuk rotan' }, { name: 'keranjang lalapan' }, { name: 'keset karet mie' },
    { name: 'kuali tumis baja' }, { name: 'lampu sorot LED' }, { name: 'lap meja microfiber' }, { name: 'mangkok ayam beling' }, { name: 'mangkok soto mawar' },
    { name: 'nampan kayu persegi' }, { name: 'nampan stainless' }, { name: 'obeng set' }, { name: 'panci sayur' }, { name: 'papan tulis putih' }, { name: 'parang daging' },
    { name: 'pengepel set roda' }, { name: 'penjepit gorengan' }, { name: 'piring beling 8in' }, { name: 'piring melamin oval' }, { name: 'piring rotan' }, { name: 'pisau fillet' },
    { name: 'rak piring susun' }, { name: 'regulator gas tekanan tinggi' }, { name: 'sapu ijuk' }, { name: 'saringan mie stainless' }, { name: 'sarung tangan karet' },
    { name: 'sekop es batu' }, { name: 'sendok makan stainless' }, { name: 'sendok teh' }, { name: 'serbet kain' }, { name: 'sikat lantai' }, { name: 'solet silikon' },
    { name: 'spatula kayu' }, { name: 'stempel validasi' }, { name: 'talenan kayu besar' }, { name: 'tampah nyiru' }, { name: 'tamper kopi' }, { name: 'tempat bumbu set' },
    { name: 'tempat dimsum 15cm' }, { name: 'tempat sendok tisu set' }, { name: 'termos es besar' }, { name: 'termos nasi' }, { name: 'timbangan digital' }, { name: 'timbangan kopi' },
    { name: 'tong sampah injak' }, { name: 'tudung saji stainless' }, { name: 'ulekan batu' }
  ]
};

export default function App() {
  const [viewMode, setViewMode] = useState('a4');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'database'
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Web App Script URL
  const [gasUrl, setGasUrl] = useState(() => {
    return localStorage.getItem('bapa_gas_url') || "https://script.google.com/macros/s/AKfycbx8wcNzB8I8Vx3i-Q8Viubi83NtxifYOu6KSZFPv6LZA1osBTrGj2pTwRbt148Q1uEb/exec";
  });

  // Modal Asset Selector State
  const [selectorModalOpen, setSelectorModalOpen] = useState(false);
  const [targetItemForSelector, setTargetItemForSelector] = useState(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('Semua');

  // Form State
  const generateInitialDocNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `FPD/${year}/${month}/${random}`;
  };

  const [selectedSenderDrop, setSelectedSenderDrop] = useState('Ayam Goreng Makmur Karya');
  const [selectedReceiverDrop, setSelectedReceiverDrop] = useState('Gudang Aset');

  const [formData, setFormData] = useState({
    docNumber: generateInitialDocNumber(),
    date: new Date().toISOString().split('T')[0],
    reason: 'Pergantian Aset Baru',
    senderName: 'Ayam Goreng Makmur Karya',
    senderAddress: 'Jl. Karya Baru No. 15, Pontianak',
    receiverName: 'Gudang Aset',
    receiverAddress: 'Jl. Ahmad Yani No. 88, Pontianak (Pusat Aset Utama)',
  });

  const [items, setItems] = useState([
    { id: 1, accountCategory: 'Peralatan', description: 'kursi plastik', qty: 2, uom: 'Unit', condition: 'Tidak Layak Pakai', itemReason: 'Patah bagian kaki', image: null },
    { id: 2, accountCategory: 'Peralatan', description: 'dispenser', qty: 1, uom: 'Unit', condition: 'Tidak Standar', itemReason: 'Kran bocor', image: null },
    { id: 3, accountCategory: 'Peralatan', description: '(Jadul) Kursi Lesehan Rotan', qty: 4, uom: 'Unit', condition: 'Layak Pakai', itemReason: 'Tutup outlet', image: null },
  ]);

  const [signatures, setSignatures] = useState([
    { title: 'Diajukan Oleh,', name: 'Budi Santoso', role: 'Manager Outlet' },
    { title: 'Mengetahui/Approve,', name: 'Rudi Hermawan', role: 'Area Operation Lead' },
    { title: 'Diterima Oleh,', name: 'Agus Supriyadi', role: 'Head of Asset & Logistics' }
  ]);

  const [receipts, setReceipts] = useState([]);
  const [historyLogs, setHistoryLogs] = useState(() => {
    return JSON.parse(localStorage.getItem('bapa_history_logs') || '[]');
  });

  // Auto-Save Draft to LocalStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('bapa_form_draft_v2');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.items) setItems(parsed.items);
        if (parsed.signatures) setSignatures(parsed.signatures);
        if (parsed.receipts) setReceipts(parsed.receipts);
        if (parsed.selectedSenderDrop) setSelectedSenderDrop(parsed.selectedSenderDrop);
        if (parsed.selectedReceiverDrop) setSelectedReceiverDrop(parsed.selectedReceiverDrop);
      } catch (e) {
        console.error("Gagal memuat draft", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!formData.docNumber) return;
    try {
      localStorage.setItem('bapa_form_draft_v2', JSON.stringify({
        formData, items, signatures, receipts, selectedSenderDrop, selectedReceiverDrop
      }));
    } catch (e) {
      console.warn("Storage quota limit reached");
    }
  }, [formData, items, signatures, receipts, selectedSenderDrop, selectedReceiverDrop]);

  // Total Quantity Calculation
  const totalQuantity = useMemo(() => {
    return items.reduce((acc, item) => acc + (parseInt(item.qty, 10) || 0), 0);
  }, [items]);

  // Master Items Search Filter
  const filteredMasterItems = useMemo(() => {
    const list = [];
    const categoriesToSearch = assetCategoryFilter === 'Semua' 
      ? ACCOUNT_CATEGORIES 
      : [assetCategoryFilter];

    categoriesToSearch.forEach(cat => {
      if (MASTER_ITEMS[cat]) {
        MASTER_ITEMS[cat].forEach(item => {
          if (item.name.toLowerCase().includes(assetSearchQuery.toLowerCase())) {
            list.push({ ...item, category: cat });
          }
        });
      }
    });

    return list;
  }, [assetSearchQuery, assetCategoryFilter]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSenderChange = (e) => {
    const val = e.target.value;
    setSelectedSenderDrop(val);
    if (val !== 'Lainnya') {
      const selected = OUTLET_LIST.find(o => o.name === val);
      setFormData(prev => ({ ...prev, senderName: selected ? selected.name : val, senderAddress: selected ? selected.address : '' }));
    } else {
      setFormData(prev => ({ ...prev, senderName: '', senderAddress: '' }));
    }
  };

  const handleReceiverChange = (e) => {
    const val = e.target.value;
    setSelectedReceiverDrop(val);
    if (val !== 'Lainnya') {
      const selected = GUDANG_LIST.find(g => g.name === val);
      setFormData(prev => ({ ...prev, receiverName: selected ? selected.name : val, receiverAddress: selected ? selected.address : '' }));
    } else {
      setFormData(prev => ({ ...prev, receiverName: '', receiverAddress: '' }));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), accountCategory: 'Peralatan', description: '', qty: 1, uom: 'Unit', condition: 'Layak Pakai', itemReason: '', image: null }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSignatureChange = (index, field, value) => {
    const newSigs = [...signatures];
    newSigs[index][field] = value;
    setSignatures(newSigs);
  };

  const handleItemImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleItemChange(id, 'image', reader.result);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const generateDocNumber = () => {
    const newDoc = generateInitialDocNumber();
    setFormData(prev => ({ ...prev, docNumber: newDoc }));
    setHasSubmitted(false);
    showToast('Nomor Form Berita Acara diperbarui!', 'success');
  };

  const showToast = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Open Smart Asset Selector Modal
  const openAssetSelector = (itemId) => {
    setTargetItemForSelector(itemId);
    setAssetSearchQuery('');
    setSelectorModalOpen(true);
  };

  const selectMasterItem = (masterItem) => {
    if (targetItemForSelector) {
      handleItemChange(targetItemForSelector, 'description', masterItem.name);
      handleItemChange(targetItemForSelector, 'accountCategory', masterItem.category);
    }
    setSelectorModalOpen(false);
  };

  // Submit to Google Sheets (doPost)
  const handleSubmitToSheet = async () => {
    if (hasSubmitted) {
      showToast('Form ini sudah pernah dikirim! Klik Auto No Form untuk membuat baru.', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Gagal! Minimal harus ada 1 barang aset yang diajukan.', 'error');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].description || !items[i].itemReason) {
        showToast(`Gagal! Baris ke-${i + 1} belum lengkap (Nama Aset dan Alasan wajib diisi).`, 'error');
        return;
      }
    }

    setIsSubmitting(true);
    showToast('Sedang menghubungkan ke Google Sheets...', 'info');

    const payload = {
      docNumber: formData.docNumber,
      date: formData.date,
      reason: formData.reason,
      sender: formData.senderName,
      receiver: formData.receiverName,
      items: items.map(item => ({
        akun: item.accountCategory,
        namaAset: item.description,
        kategori: item.uom,
        qty: item.qty,
        kondisi: `${item.condition}${item.itemReason ? ' - ' + item.itemReason : ''}`,
        adaGambar: item.foto ? "Ada Foto" : "Tidak Ada"
      }))
    };

    try {
      if (gasUrl) {
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      }

      setHasSubmitted(true);
      
      const newHistory = [
        {
          timestamp: new Date().toLocaleString('id-ID'),
          docNumber: formData.docNumber,
          sender: formData.senderName,
          receiver: formData.receiverName,
          totalItem: items.length,
          totalQty: totalQuantity,
          reason: formData.reason
        },
        ...historyLogs
      ];
      setHistoryLogs(newHistory);
      localStorage.setItem('bapa_history_logs', JSON.stringify(newHistory));

      showToast(`✅ Data Berita Acara ${formData.docNumber} Berhasil Dikirim ke Google Sheets!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('⚠️ Gagal terhubung ke Google Sheets, namun data disimpan secara lokal.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Print & Export Handlers
  const handlePrint = () => window.print();

  const handleDownloadImage = async () => {
    if (!window.html2canvas) return showToast('Memuat pustaka gambar...', 'error');
    const el = document.getElementById('print-wrapper');
    if (el) {
      try {
        showToast('Memproses berkas PNG high-resolution...', 'info');
        const canvas = await window.html2canvas(el, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
        const link = document.createElement('a');
        link.download = `Berita_Acara_${formData.docNumber.replace(/\//g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Gambar Berita Acara Berhasil Diunduh!', 'success');
      } catch (err) {
        showToast('Gagal memproses gambar.', 'error');
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!window.html2canvas || !window.jspdf) return showToast('Memuat pustaka PDF...', 'error');
    const el = document.getElementById('print-wrapper');
    if (el) {
      try {
        setIsPdfLoading(true);
        showToast('Menyusun dokumen PDF A4...', 'info');
        const canvas = await window.html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Berita_Acara_${formData.docNumber.replace(/\//g, '_')}.pdf`);
        showToast('PDF Berita Acara Berhasil Diunduh!', 'success');
      } catch (err) {
        showToast('Gagal membuat PDF.', 'error');
      } finally {
        setIsPdfLoading(false);
      }
    }
  };

  // Pagination for A4 Print (12 items / page)
  const ITEMS_PER_PAGE = 12;
  const itemChunks = useMemo(() => {
    if (items.length === 0) return [[]];
    const chunks = [];
    for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
      chunks.push(items.slice(i, i + ITEMS_PER_PAGE));
    }
    return chunks;
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col">
      
      {/* Toast Notification */}
      {statusMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300 w-full max-w-lg px-4">
          <div className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md ${
            statusMsg.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
            statusMsg.type === 'info' ? 'bg-sky-950/90 border-sky-500/50 text-sky-200' :
            'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle className="text-emerald-400 shrink-0" size={24} /> :
             statusMsg.type === 'info' ? <Loader2 className="text-sky-400 animate-spin shrink-0" size={24} /> :
             <AlertTriangle className="text-rose-400 shrink-0" size={24} />}
            <div className="flex-1 text-sm font-medium">{statusMsg.text}</div>
            <button onClick={() => setStatusMsg(null)} className="p-1 hover:bg-white/10 rounded-lg"><X size={16}/></button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 no-print shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-900/40">
              <ClipboardList size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">Form Pengajuan Disposisi</h1>
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-800/60 px-2 py-0.5 rounded-full font-bold">Aset Enterprise</span>
              </div>
              <p className="text-xs text-slate-400">Berita Acara Serah Terima & Pengembalian Aset Terintegrasi</p>
            </div>
          </div>

          {/* View Mode & Tab Actions */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button onClick={() => setActiveTab('editor')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'editor' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
              <FileText size={15} /> Editor Form
            </button>
            <button onClick={() => setActiveTab('database')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'database' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
              <History size={15} /> Riwayat ({historyLogs.length})
            </button>
          </div>

          {/* Main Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button 
              onClick={handleSubmitToSheet} 
              disabled={isSubmitting || hasSubmitted} 
              className={`flex items-center gap-2 text-white px-4 py-2 rounded-xl font-bold shadow-lg text-xs transition-all ${
                hasSubmitted ? 'bg-slate-700 cursor-not-allowed opacity-80' : 
                isSubmitting ? 'bg-sky-700 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/30'
              }`}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : hasSubmitted ? <CheckCircle size={16} /> : <CloudUpload size={16} />}
              <span>{isSubmitting ? 'Mengirim...' : hasSubmitted ? 'Tersimpan' : 'Simpan DB / Google Sheets'}</span>
            </button>

            <button onClick={handleDownloadImage} className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/40 transition">
              <ImageIcon size={16} /> <span>Gambar</span>
            </button>
            
            <button onClick={handleDownloadPDF} disabled={isPdfLoading} className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-600 text-white px-3 py-2 rounded-xl font-bold text-xs shadow-lg shadow-rose-950/40 transition">
              {isPdfLoading ? <Loader2 size={16} className="animate-spin" /> : <FileType size={16} />}
              <span>PDF</span>
            </button>

            <button onClick={handlePrint} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl font-bold text-xs border border-slate-700 transition">
              <Printer size={16} /> <span>Print</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* TAB 1: FORM EDITOR & LIVE PREVIEW */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: FORM CONTROLS (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 no-print">
              
              {/* CARD 1: INFORMASI DOKUMEN */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Info size={14} className="text-blue-400" /> Informasi Dokumen
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{formData.docNumber}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Nomor Dokumen (Form No.)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        name="docNumber" 
                        value={formData.docNumber} 
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-sky-400 focus:outline-none focus:border-sky-500" 
                      />
                      <button 
                        onClick={generateDocNumber}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                      >
                        <RefreshCw size={13} /> Auto
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Tanggal Pengajuan</label>
                      <input 
                        type="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Alasan Disposisi</label>
                      <select 
                        name="reason" 
                        value={formData.reason} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Pergantian Aset Baru">Pergantian Aset Baru</option>
                        <option value="Pengembalian Aset Rusak">Pengembalian Aset Rusak</option>
                        <option value="Penutupan Outlet / Cabang">Penutupan Outlet / Cabang</option>
                        <option value="Mutasi / Pemindahan Aset">Mutasi / Pemindahan Aset</option>
                        <option value="Pengafkirannya (Scrap)">Pengafkirannya (Scrap)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: RUTE DISPOSISI */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                  <ArrowLeftRight size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rute Disposisi (Pengirim ➡️ Penerima)</span>
                </div>

                <div className="space-y-3">
                  {/* DARI */}
                  <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl">
                    <label className="text-[10px] font-extrabold text-amber-400 uppercase mb-1.5 block flex items-center gap-1">
                      <Building2 size={12} /> Dari (Outlet/Divisi Pengirim)
                    </label>
                    <select 
                      value={selectedSenderDrop} 
                      onChange={handleSenderChange} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-semibold mb-2"
                    >
                      {OUTLET_LIST.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
                    </select>
                    {selectedSenderDrop === 'Lainnya' && (
                      <input 
                        type="text" 
                        name="senderName" 
                        placeholder="Ketik Nama Outlet / Divisi..." 
                        value={formData.senderName} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mb-2" 
                      />
                    )}
                    <textarea 
                      name="senderAddress" 
                      placeholder="Alamat Lengkap Outlet/Divisi..." 
                      value={formData.senderAddress} 
                      onChange={handleInputChange} 
                      rows={2} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 leading-tight" 
                    />
                  </div>

                  {/* KE */}
                  <div className="bg-sky-950/20 border border-sky-900/40 p-3 rounded-xl">
                    <label className="text-[10px] font-extrabold text-sky-400 uppercase mb-1.5 block flex items-center gap-1">
                      <Building2 size={12} /> Ke (Gudang Tujuan)
                    </label>
                    <select 
                      value={selectedReceiverDrop} 
                      onChange={handleReceiverChange} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-semibold mb-2"
                    >
                      {GUDANG_LIST.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                    </select>
                    {selectedReceiverDrop === 'Lainnya' && (
                      <input 
                        type="text" 
                        name="receiverName" 
                        placeholder="Ketik Nama Gudang Tujuan..." 
                        value={formData.receiverName} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mb-2" 
                      />
                    )}
                    <textarea 
                      name="receiverAddress" 
                      placeholder="Alamat Lengkap Gudang..." 
                      value={formData.receiverAddress} 
                      onChange={handleInputChange} 
                      rows={2} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 leading-tight" 
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3: ASET YANG DIAJUKAN DISPOSISI */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-red-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Aset yang Diajukan Disposisi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                      {items.length} Baris ({totalQuantity} Unit)
                    </span>
                    <button 
                      onClick={addItem} 
                      className="bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-300 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Plus size={13} /> Tambah
                    </button>
                  </div>
                </div>

                {/* Asset Item Cards List */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {items.map((item, index) => (
                    <div key={item.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 relative group hover:border-slate-700 transition">
                      
                      {/* Row 1: Kategori & Nama Aset Selector */}
                      <div className="flex items-center gap-2">
                        <select 
                          value={item.accountCategory} 
                          onChange={(e) => handleItemChange(item.id, 'accountCategory', e.target.value)} 
                          className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-300"
                        >
                          {ACCOUNT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <div className="w-2/3 flex gap-1">
                          <input 
                            type="text" 
                            placeholder="Nama Aset / Barang..." 
                            value={item.description} 
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:border-red-500 focus:outline-none" 
                          />
                          <button 
                            type="button" 
                            onClick={() => openAssetSelector(item.id)} 
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 rounded-lg text-xs flex items-center justify-center shrink-0" 
                            title="Pilih dari Master Data (400+ Item)"
                          >
                            <Search size={13} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition" 
                          title="Hapus Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Row 2: Qty, Satuan, Kondisi */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">QTY</label>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.qty} 
                            onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-center text-white" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">SATUAN</label>
                          <select 
                            value={item.uom} 
                            onChange={(e) => handleItemChange(item.id, 'uom', e.target.value)} 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-xs text-center text-slate-300"
                          >
                            {UOM_OPTIONS.map((g, idx) => (
                              <optgroup key={idx} label={g.group}>
                                {g.items.map(u => <option key={u} value={u}>{u}</option>)}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">KONDISI</label>
                          <select 
                            value={item.condition} 
                            onChange={(e) => handleItemChange(item.id, 'condition', e.target.value)} 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-xs font-bold text-center text-rose-400"
                          >
                            {CONDITION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Row 3: Alasan Pengembalian & Foto */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          placeholder="* Alasan / Detail Kerusakan (Jelas)..." 
                          value={item.itemReason || ''} 
                          onChange={(e) => handleItemChange(item.id, 'itemReason', e.target.value)} 
                          className="w-full bg-slate-950 border border-rose-950/80 rounded-lg px-2.5 py-1 text-xs text-rose-300 placeholder:text-rose-900/60 focus:border-rose-600 focus:outline-none" 
                        />
                        <label className="bg-sky-950 border border-sky-800/60 text-sky-300 hover:bg-sky-900 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 shrink-0">
                          <Camera size={11} /> + Foto
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleItemImageUpload(item.id, e)} />
                        </label>
                      </div>

                      {item.image && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 mt-1">
                          <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                          <button onClick={() => handleItemChange(item.id, 'image', null)} className="absolute top-0 right-0 bg-rose-600 text-white p-0.5 rounded-bl"><X size={10}/></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: KOLOM TANDA TANGAN */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                  <PenTool size={14} className="text-purple-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Kolom Tanda Tangan</span>
                </div>

                <div className="space-y-2">
                  {signatures.map((sig, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl space-y-1.5">
                      <input 
                        type="text" 
                        value={sig.title} 
                        onChange={(e) => handleSignatureChange(idx, 'title', e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-300" 
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="Nama Terang" 
                          value={sig.name} 
                          onChange={(e) => handleSignatureChange(idx, 'name', e.target.value)} 
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white" 
                        />
                        <input 
                          type="text" 
                          placeholder="Divisi/Jabatan" 
                          value={sig.role} 
                          onChange={(e) => handleSignatureChange(idx, 'role', e.target.value)} 
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-400" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: LIVE A4 PRINT PREVIEW DOCUMENT (7 Cols) */}
            <div className="lg:col-span-7 flex justify-center bg-slate-950 border border-slate-800 p-4 rounded-2xl items-start overflow-x-auto shadow-2xl">
              
              <div id="print-wrapper" className="flex flex-col gap-6 w-full items-center">
                {itemChunks.map((chunk, pageIndex) => (
                  <div 
                    key={`page-${pageIndex}`}
                    className="print-area bg-white text-slate-900 shadow-2xl flex flex-col relative overflow-hidden tracking-normal leading-normal transition-all"
                    style={{ 
                      width: '210mm', 
                      minHeight: '297mm', 
                      padding: '16mm 18mm', 
                      fontSize: '10pt', 
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* A4 Header */}
                    <div className="border-b-2 border-slate-900 pb-3 mb-3">
                      <div className="flex justify-between items-start">
                        <div className="w-2/3">
                          <h1 className="text-2xl font-black uppercase tracking-tight text-red-900">BERITA ACARA</h1>
                          <div className="bg-red-900 text-white px-2.5 py-0.5 inline-block text-[10px] font-extrabold mt-1 uppercase tracking-widest rounded-sm">
                            PENGAJUAN DISPOSISI
                          </div>
                        </div>
                        <div className="text-right w-1/3">
                          <div className="text-[9px] text-slate-500 uppercase font-extrabold">
                            NOMOR DOKUMEN {itemChunks.length > 1 && `(Hal ${pageIndex + 1}/${itemChunks.length})`}
                          </div>
                          <div className="text-sm font-bold font-mono text-slate-900">{formData.docNumber}</div>
                          <div className="text-[9px] text-slate-500 uppercase font-extrabold mt-1">TANGGAL</div>
                          <div className="text-xs font-semibold text-slate-800">
                            {new Date(formData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alasan Disposisi Box */}
                    <div className="bg-slate-100 border-l-4 border-red-900 p-2.5 rounded-sm mb-3">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase block">ALASAN DISPOSISI:</span>
                      <h3 className="font-extrabold text-sm text-red-900 mt-0.5">{formData.reason || '-'}</h3>
                    </div>

                    {/* Route Grid Box */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="border border-slate-300 rounded p-2 bg-slate-50">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase block border-b border-slate-200 pb-0.5 mb-1">
                          DARI (OUTLET/DIVISI PENGIRIM)
                        </span>
                        <div className="font-bold text-xs text-slate-900">{formData.senderName}</div>
                        <div className="text-[10px] text-slate-600 leading-tight mt-0.5">{formData.senderAddress}</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 bg-slate-50">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase block border-b border-slate-200 pb-0.5 mb-1">
                          KE (GUDANG TUJUAN)
                        </span>
                        <div className="font-bold text-xs text-slate-900">{formData.receiverName}</div>
                        <div className="text-[10px] text-slate-600 leading-tight mt-0.5">{formData.receiverAddress}</div>
                      </div>
                    </div>

                    {/* Statement */}
                    <p className="text-[11px] font-semibold text-slate-800 mb-2">
                      Menyerahkan aset/barang dengan rincian dan kondisi sebagai berikut:
                    </p>

                    {/* Document Table */}
                    <div className="mb-4 flex-1">
                      <table className="w-full border-collapse border border-slate-900">
                        <thead>
                          <tr className="bg-red-50 border-b-2 border-slate-900 text-[9px] uppercase font-bold text-red-950">
                            <th className="border border-slate-900 py-1.5 px-1 text-center w-[5%]">NO</th>
                            <th className="border border-slate-900 py-1.5 px-2 text-left w-[45%]">NAMA ASET/BARANG</th>
                            <th className="border border-slate-900 py-1.5 px-1 text-center w-[8%]">QTY</th>
                            <th className="border border-slate-900 py-1.5 px-1 text-center w-[10%]">SATUAN</th>
                            <th className="border border-slate-900 py-1.5 px-1 text-center w-[17%]">KONDISI</th>
                            <th className="border border-slate-900 py-1.5 px-1 text-center w-[15%]">FOTO</th>
                          </tr>
                        </thead>
                        <tbody className="text-[11px]">
                          {chunk.map((item, idx) => {
                            const actualNumber = pageIndex * ITEMS_PER_PAGE + idx + 1;
                            return (
                              <tr key={item.id} className="bg-white">
                                <td className="border border-slate-900 py-1 px-1.5 text-center font-bold align-top">{actualNumber}</td>
                                <td className="border border-slate-900 py-1 px-2 align-top">
                                  <div className="font-bold text-slate-900">{item.description || 'Aset Tanpa Nama'}</div>
                                  <span className="text-[9px] text-slate-500 font-medium block">{item.accountCategory}</span>
                                  {item.itemReason && (
                                    <span className="text-[10px] text-red-900 italic font-medium mt-0.5 block">
                                      Alasan: {item.itemReason}
                                    </span>
                                  )}
                                </td>
                                <td className="border border-slate-900 py-1 px-1 text-center font-black align-top">{item.qty}</td>
                                <td className="border border-slate-900 py-1 px-1 text-center align-top">{item.uom}</td>
                                <td className={`border border-slate-900 py-1 px-1 text-center font-bold align-top ${
                                  item.condition.includes('Tidak') || item.condition.includes('Rusak') ? 'text-red-700' : 'text-emerald-700'
                                }`}>
                                  {item.condition}
                                </td>
                                <td className="border border-slate-900 p-1 text-center align-middle h-[42px]">
                                  {item.image ? (
                                    <img src={item.image} alt="Foto" className="h-full w-full object-contain mx-auto" />
                                  ) : (
                                    <span className="text-[9px] text-slate-400 italic">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Closing Statement & Signatures */}
                    <div className="mt-auto pt-2">
                      <p className="text-[10px] italic font-medium text-slate-700 text-center mb-4 border-t border-b border-dashed border-slate-300 py-1.5">
                        "Dengan ini mengajukan Disposisi terkait Aset-Aset diatas agar dapat diproses selanjutnya, adapun keterangan diatas dibuat dengan sebenar-benarnya dan dapat di pertanggung jawabkan."
                      </p>

                      <div className="grid grid-cols-3 gap-3 text-center text-[11px]">
                        {signatures.map((sig, idx) => (
                          <div key={idx}>
                            <p className="font-semibold text-slate-700 mb-14">{sig.title || '...'}</p>
                            <div className="border-b border-slate-900 w-4/5 mx-auto mb-1"></div>
                            <p className="font-extrabold uppercase text-slate-900 truncate">{sig.name || '...'}</p>
                            <p className="text-[9px] text-slate-600 truncate">{sig.role ? `(${sig.role})` : '(........................)'}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: HISTORY LOGS & GOOGLE SHEETS SETTINGS */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="text-blue-400" size={18} /> Riwayat Pengiriman Berita Acara
                </h2>
                <p className="text-xs text-slate-400">Catatan dokumen yang telah dikirim ke Google Sheets</p>
              </div>
              <button 
                onClick={() => { localStorage.removeItem('bapa_history_logs'); setHistoryLogs([]); }}
                className="bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition"
              >
                Hapus Riwayat
              </button>
            </div>

            {historyLogs.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <History size={36} className="mx-auto mb-2 text-slate-600" />
                <p className="font-semibold text-sm">Belum ada riwayat pengiriman.</p>
                <p className="text-xs mt-1">Gunakan tombol "Simpan DB" pada form editor untuk menyimpan pengajuan.</p>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Waktu Pengiriman</th>
                        <th className="p-3">No. Dokumen</th>
                        <th className="p-3">Pengirim (Outlet)</th>
                        <th className="p-3">Penerima (Gudang)</th>
                        <th className="p-3">Total Barang</th>
                        <th className="p-3">Alasan</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {historyLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 font-mono text-slate-400">{log.timestamp}</td>
                          <td className="p-3 font-mono font-bold text-sky-400">{log.docNumber}</td>
                          <td className="p-3 font-semibold text-white">{log.sender}</td>
                          <td className="p-3 text-slate-300">{log.receiver}</td>
                          <td className="p-3 font-bold text-amber-400">{log.totalItem} Item ({log.totalQty} Unit)</td>
                          <td className="p-3 text-rose-300 italic">{log.reason}</td>
                          <td className="p-3 text-center">
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              Tersimpan
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* SMART ASSET SELECTOR MODAL (400+ ITEM SEARCH) */}
      {selectorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Search className="text-red-400" size={18} />
                <h3 className="font-bold text-sm text-white">Master Data Aset Enterprise (400+ Item)</h3>
              </div>
              <button onClick={() => setSelectorModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Search & Filter Controls */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari nama aset (misal: AC, Kursi, Printer, Dandang)..." 
                  value={assetSearchQuery} 
                  onChange={(e) => setAssetSearchQuery(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500" 
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Filter size={12} /> Kategori:
                </span>
                {['Semua', ...ACCOUNT_CATEGORIES].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setAssetCategoryFilter(cat)} 
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      assetCategoryFilter === cat 
                        ? 'bg-red-900 text-white border border-red-700' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Master Items Results Grid */}
            <div className="p-4 flex-1 overflow-y-auto space-y-1.5">
              {filteredMasterItems.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Tidak ditemukan aset yang cocok dengan pencarian "{assetSearchQuery}".
                </div>
              ) : (
                filteredMasterItems.map((masterItem, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => selectMasterItem(masterItem)} 
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition group"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">{masterItem.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      masterItem.category === 'Peralatan' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' : 'bg-sky-950 text-sky-300 border border-sky-800/50'
                    }`}>
                      {masterItem.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 text-right">
              <button onClick={() => setSelectorModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-1.5 rounded-xl text-xs font-bold transition">
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
