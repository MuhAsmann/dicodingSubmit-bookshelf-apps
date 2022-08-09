const buku = [];
const RENDER_BUKU = "render-buku";
const SAVE_BUKU = "save-buku";
const STORAGE_KEY = "Books"

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inputBook");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
  });

  if(cekStorage()){
    tampilkanBukuDariStorage(); 
  }
});

function cekStorage(){
    if(typeof (Storage) === undefined){
        alert("Browser Tidak Mendukung Local Storage");
        return false;
    }
    return true;
}

function saveBuku(){
    if(cekStorage()){
        const parsed = JSON.stringify(buku);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVE_BUKU));
    }
}

function tampilkanBukuDariStorage(){
    const dataBuku = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(dataBuku);

    if(data !== null){
        for (const bukuItem of data) {
            buku.push(bukuItem);
        }
    }

    document.dispatchEvent(new Event(RENDER_BUKU));
}

function tambahBuku() {
  const judulBuku = document.getElementById("inputBookTitle").value;
  const penulisBuku = document.getElementById("inputBookAuthor").value;
  const tahunBuku = document.getElementById("inputBookYear").value;

  const generateId = +new Date();
  const bukuObject = {
    id: generateId,
    title: judulBuku,
    author: penulisBuku,
    year: tahunBuku,
    isComplete: false,
  };
  buku.push(bukuObject);
  document.dispatchEvent(new Event(RENDER_BUKU));

  saveBuku();
}

function findBuku(idBuku) {
  for (const indexBuku of buku) {
    if (indexBuku.id === idBuku) {
      return indexBuku;
    }
  }
}

function ubahBaca(idBuku) {
  // filter
    const bukuTarget = findBuku(idBuku);

    if (bukuTarget == null) return;

    // ubah isComlete jadi true/false
    if(bukuTarget.isComplete){
        bukuTarget.isComplete = false;
    }else{
        bukuTarget.isComplete = true;
    }
    document.dispatchEvent(new Event(RENDER_BUKU));
    saveBuku();
}

function findBukuIndex(idBuku){
    for (const index in buku) {
        if(buku[index].id === idBuku){
            return index;
        }
    }
}
function hapusBuku(idBuku){
    const bukuTarget = findBukuIndex(idBuku);

    if (bukuTarget === -1 ) return;
    buku.splice(bukuTarget, 1);
    alert("Buku berhasil dihapus")
    document.dispatchEvent(new Event(RENDER_BUKU));
    saveBuku();
}


function buatBuku(bukuItem) {
  const { id, title, author, year, isComplete } = bukuItem;

  const titleBuku = document.createElement("h3");
  titleBuku.innerText = `Judul : ${title}`;
  titleBuku.style.textTransform = "uppercase";

  const authorBuku = document.createElement("p");
  authorBuku.innerText = `Penulis : ${author}`;
  authorBuku.style.textTransform = "uppercase";

  const yearBuku = document.createElement("p");
  yearBuku.innerText = `Tahun Terbit : ${year}`;
  yearBuku.style.textTransform = "uppercase";

  const bukuContainer = document.createElement("article");
  bukuContainer.append(titleBuku, authorBuku, yearBuku);
  bukuContainer.classList.add("book_item");
  bukuContainer.setAttribute("id", `buku-${id}`);

  if (isComplete) {
    const belumSelesaiButton = document.createElement("button");
    belumSelesaiButton.innerText = "Tandai Belum Selesai";
    belumSelesaiButton.classList.add("orange");
    belumSelesaiButton.addEventListener("click", function () {
      ubahBaca(id);
    });

    const hapusBukuButton = document.createElement("button");
    hapusBukuButton.innerText = "Hapus Buku";
    hapusBukuButton.classList.add("red");
    hapusBukuButton.addEventListener("click", function () {
      hapusBuku(id);
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
    actionContainer.append(belumSelesaiButton, hapusBukuButton);

    bukuContainer.append(actionContainer);
  } else {
    const selesaiButton = document.createElement("button");
    selesaiButton.innerText = "Selesai";
    selesaiButton.classList.add("green");
    selesaiButton.addEventListener("click", function () {
      ubahBaca(id);
    });

    const hapusBukuButton = document.createElement("button");
    hapusBukuButton.innerText = "Hapus Buku";
    hapusBukuButton.classList.add("red");
    hapusBukuButton.addEventListener("click", function () {
      hapusBuku(id);
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
    actionContainer.append(selesaiButton, hapusBukuButton);

    bukuContainer.append(actionContainer);
  }

  return bukuContainer;
}

document.addEventListener(RENDER_BUKU, function () {
  const listBukuBelumSelesai = document.getElementById(
    "incompleteBookshelfList"
  );
  const listBukuSudahSelesai = document.getElementById("completeBookshelfList");

  listBukuBelumSelesai.innerHTML = "";
  listBukuSudahSelesai.innerHTML = "";

  for (const bukuItem of buku) {
    const bukuElement = buatBuku(bukuItem);
    if(bukuItem.isComplete){
        listBukuSudahSelesai.append(bukuElement);
    }else{
        listBukuBelumSelesai.append(bukuElement);
    }
  }
});
