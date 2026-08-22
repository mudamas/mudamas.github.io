const categories=[
['FN','Furniture & Interior','Office furniture, workstation, meeting room, filing & storage'],
['BM','Building Materials','Semen, besi, baja, keramik, sanitary, plumbing & hardware'],
['EL','Electrical & Lighting','Panel, MCB, kabel, lampu LED, fitting & street lighting'],
['IT','Computer & IT','Desktop, laptop, printer, server, storage, networking & accessories'],
['TC','Telecommunication','Network device, fiber optic, wireless, CCTV & communication equipment'],
['TG','Textile & Garment','Seragam, batik, safety wear, sepatu, boots & custom garment'],
['PR','Printing & Office','ATK, kertas, buku, barang cetakan & printing media'],
['SF','Safety Equipment','APD, helmet, vest, gloves, safety shoes & fire safety equipment'],
['HH','Household Equipment','Housekeeping, pantry, kitchen, cleaning tools & facility support'],
['IE','Industrial Equipment','Mesin industri, pompa, kompresor, genset, engine & alat produksi'],
['MP','Machinery Parts','Suku cadang mesin, bearing, belt, seal & maintenance equipment'],
['GS','General Supplies','Kebutuhan umum operasional, proyek, dan pengadaan lintas kategori']
];
document.querySelector('#categoryGrid').innerHTML=categories.map(x=>`<article class="category"><div class="ico">${x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></article>`).join('');
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const f=document.querySelector('#rfqForm'),r=document.querySelector('#rfqResult');f?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f);r.hidden=false;r.textContent=`RINGKASAN KEBUTUHAN\nNama / Instansi: ${d.get('nama')}\nWhatsApp: ${d.get('wa')}\nKategori: ${d.get('kategori')}\nLokasi: ${d.get('lokasi')||'-'}\nKebutuhan: ${d.get('kebutuhan')}`;});
