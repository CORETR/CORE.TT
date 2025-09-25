// Form elemanlarını seç
const form = document.getElementById('embedForm');
const preview = document.getElementById('embedPreview');
const copyBtn = document.getElementById('copyJson');
const sendBtn = document.getElementById('sendDiscord');
const webhookInput = document.getElementById('webhook');
const roleInput = document.getElementById('roleid');
// Discord'a Gönder butonu
if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const webhookUrl = webhookInput.value.trim();
    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      sendBtn.textContent = 'Geçersiz Webhook!';
      setTimeout(() => sendBtn.textContent = "Discord'a Gönder", 1500);
      return;
    }
    sendBtn.textContent = 'Gönderiliyor...';
    // Rol mention
    let mentionText = '';
    const roleId = roleInput.value.trim();
    if (roleId && /^\d+$/.test(roleId)) {
      mentionText = `<@&${roleId}>`;
    }
    const data = {
      username: 'CORE.TR', // Buraya istediğin adı yaz
      avatar_url: 'https://cdn.discordapp.com/attachments/1219602673297395753/1420638627976843344/LOGO.png?ex=68d62053&is=68d4ced3&hm=2b19aabb60576b42753a9d531e21a9ed691db825c5be28b957e48458c055554f&', // Buraya istediğin avatar url'sini yaz
      content: mentionText,
      embeds: [
        {
          title: embedData.title || dummy.title,
          description: embedData.description || dummy.description,
          color: parseInt((embedData.color || dummy.color).replace('#',''), 16),
          thumbnail: embedData.thumbnail || dummy.thumbnail ? { url: embedData.thumbnail || dummy.thumbnail } : undefined,
          image: embedData.image ? { url: embedData.image } : undefined,
          footer: embedData.footer || dummy.footer ? { text: embedData.footer || dummy.footer } : undefined
        }
      ],
      allowed_mentions: roleId && /^\d+$/.test(roleId) ? { roles: [roleId] } : undefined
    };
    // Temizle undefined alanları
    if (!data.embeds[0].thumbnail.url) delete data.embeds[0].thumbnail;
    if (!data.embeds[0].image || !data.embeds[0].image.url) delete data.embeds[0].image;
    if (!data.embeds[0].footer.text) delete data.embeds[0].footer;
    if (!data.allowed_mentions) delete data.allowed_mentions;
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        sendBtn.textContent = 'Başarılı!';
      } else {
        sendBtn.textContent = 'Hata!';
      }
    } catch (err) {
      sendBtn.textContent = 'Bağlantı Hatası!';
    }
    setTimeout(() => sendBtn.textContent = "Discord'a Gönder", 1500);
  });
}

// Dummy veri ile başlangıç (alanlar boşsa gösterilecek)
const embedData = {
  title: '',
  description: '',
  color: '#5865F2',
  thumbnail: '',
  image: '',
  footer: ''
};

const dummy = {
  title: 'Başlık',
  description: 'Buraya açıklama yazabilirsin. Discord embed kutusu gibi görünür.',
  color: '#5865F2',
  thumbnail: 'https://cdn.discordapp.com/attachments/1219602673297395753/1420638627976843344/LOGO.png?ex=68d62053&is=68d4ced3&hm=2b19aabb60576b42753a9d531e21a9ed691db825c5be28b957e48458c055554f&',
  image: 'https://cdn.discordapp.com/attachments/1219602673297395753/1420638707572281416/CORETRGIF.gif?ex=68d62066&is=68d4cee6&hm=2c720a652876ce8d8db5733e6496206d6aedfcdbe683f0e7de55efecb1c32020&',
  footer: 'Alt bilgi'
};

// Formdaki her alan değiştiğinde embedData güncellenir ve önizleme yenilenir
form.addEventListener('input', (e) => {
  embedData.title = form.title.value;
  embedData.description = form.description.value;
  embedData.color = form.color.value;
  embedData.thumbnail = form.thumbnail.value;
  embedData.image = form.image.value;
  embedData.footer = form.footer.value;
  updatePreview();
});

// JSON kopyalama butonu
copyBtn.addEventListener('click', () => {
  const json = JSON.stringify({
    title: embedData.title || dummy.title,
    description: embedData.description || dummy.description,
    color: embedData.color || dummy.color,
    thumbnail: embedData.thumbnail || dummy.thumbnail,
    image: embedData.image || dummy.image,
    footer: embedData.footer || dummy.footer
  }, null, 2);
  copyToClipboard(json);
  copyBtn.textContent = "Kopyalandı!";
  setTimeout(() => copyBtn.textContent = "JSON çıktısını kopyala", 1500);
});

// Panoya kopyalama fonksiyonu
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // Eski tarayıcılar için fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

// Embed önizlemesini güncelle
function updatePreview() {
  // Saat güncelle
  document.getElementById('msgTime').textContent = getTimeString();
  // Alanlar boşsa dummy veri kullan
  const data = {
    title: embedData.title || dummy.title,
    description: embedData.description || dummy.description,
    color: embedData.color || dummy.color,
    thumbnail: embedData.thumbnail || dummy.thumbnail,
    image: embedData.image || dummy.image,
    footer: embedData.footer || dummy.footer
  };
  preview.innerHTML = `
    <div class="embed-color" style="background:${data.color};"></div>
    <div class="embed-content">
      ${data.title ? `<div class="embed-title">${escapeHtml(data.title)}</div>` : ''}
      ${data.description ? `<div class="embed-description">${escapeHtml(data.description)}</div>` : ''}
      ${data.image ? `<img class="embed-image" src="${escapeHtml(data.image)}" alt="Embed Image" onerror="this.style.display='none'">` : ''}
      ${data.footer ? `<div class="embed-footer">${escapeHtml(data.footer)}</div>` : ''}
    </div>
    ${data.thumbnail ? `<img class="embed-thumbnail" src="${escapeHtml(data.thumbnail)}" alt="Thumbnail" onerror="this.style.display='none'">` : ''}
  `;
}

// Saat stringi (örn: 15:42)
function getTimeString() {
  const now = new Date();
  return now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

// XSS koruması için HTML kaçış fonksiyonu
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}

// İlk önizleme
updatePreview();

// Saat her dakika güncellensin
setInterval(updatePreview, 60000);
updatePreview();
