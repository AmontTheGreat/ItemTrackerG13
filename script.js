document.addEventListener("DOMContentLoaded", () => {
  const itemForm = document.getElementById('itemForm');
  const itemList = document.getElementById('itemList');
  const addItemPage = document.getElementById('addItemPage');
  const viewItemPage = document.getElementById('viewItemPage');

  function showAddItem() {
    console.log("Add Item clicked");
    itemList.classList.add('hidden');
    addItemPage.classList.remove('hidden');
    viewItemPage.classList.add('hidden');
  }

  function viewItem(name, imgSrc) {
    document.getElementById('viewName').textContent = name;
    document.getElementById('viewImage').src = imgSrc;

    itemList.classList.add('hidden');
    addItemPage.classList.add('hidden');
    viewItemPage.classList.remove('hidden');

    // ✅ Generate QR code
    QRCode.toCanvas(document.createElement('canvas'), name, function (error, canvas) {
      const qrContainer = document.getElementById('viewQrCode');
      qrContainer.innerHTML = '';
      if (error) {
        console.error(error);
      } else {
        qrContainer.appendChild(canvas);
      }
    });
  }

  function goBack() {
    addItemPage.classList.add('hidden');
    viewItemPage.classList.add('hidden');
    itemList.classList.remove('hidden');
  }

  itemForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('itemName').value;
    const file = document.getElementById('itemImage').files[0];
    const reader = new FileReader();

    reader.onload = function() {
      const imgSrc = reader.result;
      const div = document.createElement('div');
      div.className = 'itemCard';
      div.onclick = () => viewItem(name, imgSrc);
      div.innerHTML = `<img src="${imgSrc}" alt="${name}" /><p>${name}</p>`;
      itemList.appendChild(div);

      goBack();
      itemForm.reset();
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  // ✅ Initial state
  itemList.classList.remove('hidden');
  addItemPage.classList.add('hidden');
  viewItemPage.classList.add('hidden');

  // ✅ Make functions globally available for inline `onclick=`
  window.showAddItem = showAddItem;
  window.goBack = goBack;
});
