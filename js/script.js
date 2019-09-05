let images = new Object();
let imagesCount= 0;
let regExpJson= /\.(json)$/;
let regExpImg = /\.(gif|jpg|jpeg|tiff|png)$/;
let row = new Object();
let widthRow = 0;
let minWidth = 320;
let marginRight = 5;

function getIndentForDevice () {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    return 20;
  } else {
    return 45;
  }
}

let getJSON = function(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    let status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

function isImg(url)  {
 return regExpImg.test(url);
}

function isJson(url) {
  return regExpJson.test(url);
}

function loadImgLink (url) {
  let image = new Image();
  image.classList.add('gallery__img-'+ $('.gallery__content img').length);
  image.src = url;
  image.onload = function() {
    this.width  = this.width * 200/ this.height;
    this.height= 200;
    images[$('.gallery__content img').length]= Object.assign({},  {"url": url , "width" :  this.width, "height" : this.height });
    clearGallery();
    addImgs();
  }
  image.onerror = function() {
    alert("Ошибка во время загрузки изображения");
  };
}

function loadJsonLink (url) {
  getJSON( url ,
    function(err, result) {
      if (err !== null) {
        alert('Something went wrong: ' + err);
      } else {
          result;
          jsonParse(result);
          clearGallery();
          addImgs();
        }
    });
}

function buttonLoadImg (inputField) {
  if (inputField.files && inputField.files[0]) {
    var reader = new FileReader();
    $(reader).load(function(e) { 
        let url =e.target.result;
        let image = new Image();
        image.classList.add('gallery__img-'+ $('.gallery__content img').length);
        image.src = e.target.result;
        image.onload = function() {
          this.width  = this.width * 200/ this.height;
          this.height= 200;
          images[$('.gallery__content img').length]= Object.assign({},  {"url": url , "width" :  this.width, "height" : this.height });
          clearGallery();
          addImgs();
        }
    });
    reader.readAsDataURL(inputField.files[0]);
  }
}
function buttonLoadJson(inputField) {
  let file = null;
  if (inputField.files && inputField.files[0]) {
      file = new FileReader();
      file.onload = function() {
        result =  JSON.parse(file.result);
        jsonParse(result);
        clearGallery();
        addImgs();
      };
      file.onerror = function() {
        alert("Ошибка во время загрузки json файла ");
      };
      file.readAsText(inputField.files[0]);
  }
}

function jsonParse(result){
  Object.entries(result).forEach(
    ([key, value]) => {
      Object.entries(value).forEach(([key, value]) => {
        value.width  = value.width * 200/  value.height;
        value.height = 200;
        images[$('.gallery__content img').length + Number(key)]= Object.assign({}, value);
      });                 
    }
  );
}

function uploadImages() {
  let url  =  $('.loader-images__input').val();
  let uploadFile =  $('.loader-images__input-file').val();
  let inputField =  document.getElementsByClassName("loader-images__input-file")[0];

  if (url.trim() === '' && uploadFile === ''){
    alert("Выберете файл или введите url до файла");
    return;
  }

  if (url.trim() != ''){
    if ( isImg(url)) {
      loadImgLink (url);
    } else if (isJson(url)) {
      loadJsonLink (url);
    } 
    else {
      alert("Выберете файл или введите url до файла");
    }
  } 
  
  if (uploadFile != ''){
      if (isImg(uploadFile)) {
        buttonLoadImg (inputField)
      }
      else if (isJson(uploadFile)) {
        buttonLoadJson(inputField)
      }
      else {
        alert("Неверный формат файла");
      }
  }  
}

function addImgs(){
  imagesCount = Object.keys(images).length -1;
  Object.entries(images).forEach(([key, img]) => {
    let photo = document.createElement("img");
    photo.classList.add('gallery__img-'+ key);
    photo.src = img.url;
    photo.style.width =  img.width + "px" ;
    photo.style.height = img.height  + "px";
    $('.gallery__content').append(photo); 

  });  
  $('.loader-images__input').val('');
  sizeImages($('.gallery__content').width() - getIndentForDevice ());
}

function sizeImages(widthGallery ) {

  if( document.documentElement.clientWidth >  minWidth  ){
    row = {};

    let needHeight = 200;

    Object.entries(images).forEach(([key, value]) => {
      row[key] = value;
      widthRow += value.width;
      if (widthRow > widthGallery && Object.keys(row).length !== 1 ) { 
        let imgToRow = Object.keys(row);
        widthRow += (imgToRow.length -1)*marginRight
        imgToRow = imgToRow[imgToRow.length -1];     
        let heightRow = needHeight  * widthGallery/ widthRow; 
        Object.entries(row).forEach(([key, img]) => { 

          let width =  img.width * heightRow/ img.height + "px" ;

          if (key != imgToRow  ){
            $('.gallery__img-'+key).css("margin-right", marginRight);      
          } else {
            $('.gallery__img-'+key).css("margin-right","unset")
          }
            $('.gallery__img-'+key).css({"width":width, "height": heightRow })
        });  

        row = {};
        widthRow = 0;
      }
      if(key == imagesCount){
        if(Object.keys(row).length != 0){
          Object.entries(row).forEach(([key, img]) => {
            widthRow += imagesCount * marginRight;
            $('.gallery__img-'+key).css("margin-right", marginRight);      
            let heightRow = needHeight  * widthGallery/ widthRow;
            heightRow= img.height;
            if (widthGallery < 600 )
              heightRow= img.height/1.3;
            let width =  img.width * heightRow/ img.height + "px" ;
            $('.gallery__img-'+key).css({"width": width, "height":heightRow })
          });
          row = {};
          widthRow = 0;
        }
      }
    });    
  }
}



window.onresize = function(e){
    $('.gallery__content').css({"width": document.documentElement.clientWidth -25 });
    sizeImages($('.gallery__content').width() - getIndentForDevice());  
}

$(document).ready(function () {
  let observer = new MutationObserver(function(mutations) {
    sizeImages($('.gallery__content').width() - getIndentForDevice ());
  });
  
  let child = document.querySelector('.gallery__content');
  observer.observe(child, { attributes: true });
 });


 function getFileName() {
  $('.loader-images__file-name').text($('.loader-images__input-file').val().split("\\").pop());
}

function chooseFile(){
  $('.loader-images__input-file').click();
  $('.loader-images__input').val('');
}

function removeUploadedFile() {
  $('.loader-images__input-file').val('');
  $('.loader-images__file-name').text('');
}

function clearGallery(clearImages) {
  if(clearImages === 'Y')
    images={};
  $('.gallery__content img').remove();
}
