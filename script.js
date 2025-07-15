document.addEventListener("DOMContentLoaded", () => {
  const itemForm = document.getElementById('itemForm');
  const itemList = document.getElementById('itemList');
  const addItemPage = document.getElementById('addItemPage');
  const viewItemPage = document.getElementById('viewItemPage');

  const items = JSON.parse(localStorage.getItem('items') || '[]');

  function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
  }

  function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }

  function renderItems() {
    itemList.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'itemCard';
      div.onclick = () => viewItem(item);
      div.innerHTML = `<img src="${item.img}" alt="${item.name}" /><p>${item.name}</p>`;
      itemList.appendChild(div);
    });
  }

  function showAddItem() {
    console.log("Add Item clicked");
    itemList.classList.add('hidden');
    addItemPage.classList.remove('hidden');
    viewItemPage.classList.add('hidden');
  }

  function viewItem(item) {
    document.getElementById('viewName').textContent = item.name;
    document.getElementById('viewImage').src = item.img;

    itemList.classList.add('hidden');
    addItemPage.classList.add('hidden');
    viewItemPage.classList.remove('hidden');

    // ✅ Show QR code with item.id
    const qrContainer = document.getElementById('viewQrCode');
    qrContainer.innerHTML = '';
    QRCode.toCanvas(item.id, function (error, canvas) {
      if (error) console.error(error);
      else qrContainer.appendChild(canvas);
    });
  }

  function goBack() {
    addItemPage.classList.add('hidden');
    viewItemPage.classList.add('hidden');
    itemList.classList.remove('hidden');
  }

  itemForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('itemName').value;
    const file = document.getElementById('itemImage').files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const imgSrc = reader.result;
      const id = generateId();

      const newItem = { id, name, img: imgSrc };
      items.push(newItem);
      saveItems();

      const div = document.createElement('div');
      div.className = 'itemCard';
      div.onclick = () => viewItem(newItem);
      div.innerHTML = `<img src="${imgSrc}" alt="${name}" /><p>${name}</p>`;
      itemList.appendChild(div);

      goBack();
      itemForm.reset();
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  // Initial load
  renderItems();
  itemList.classList.remove('hidden');
  addItemPage.classList.add('hidden');
  viewItemPage.classList.add('hidden');

  // Make inline functions work
  window.showAddItem = showAddItem;
  window.goBack = goBack;
});

document.getElementById('qrUpload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    const img = new Image();
    img.src = reader.result;

    img.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        const scannedId = code.data.trim();
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        const match = items.find(item => item.id === scannedId);

        if (match) {
          document.getElementById('viewName').textContent = match.name;
          document.getElementById('viewImage').src = match.img;
          const qrContainer = document.getElementById('viewQrCode');
          qrContainer.innerHTML = '';
          QRCode.toCanvas(match.id, function (error, canvas) {
            if (!error) qrContainer.appendChild(canvas);
          });

          document.getElementById('itemList').classList.add('hidden');
          document.getElementById('addItemPage').classList.add('hidden');
          document.getElementById('viewItemPage').classList.remove('hidden');
        } else {
          alert('QR code does not match any saved items.');
        }
      } else {
        alert('No QR code detected in the image.');
      }
    };
  };

  reader.readAsDataURL(file);
});
