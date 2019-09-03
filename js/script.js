// let widthScreen = document.documentElement.clientWidth -45;
let images = new Object();
let imagesCount= 0;
let regExpJson= /\.(json)$/;
let regExpImg = /\.(gif|jpg|jpeg|tiff|png)$/;
let row = new Object();
let widthRow = 0;





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

function getIndentForDevice () {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    return 20;
  } else {
    return 30;
  }
}


function uploadImages() {
  let url  =  $('.loader-images__input').val();
  if (url.trim() != ''){
    if ( regExpImg.test(url)) {
      let image = new Image();
      image.classList.add('gallery__img-'+ $('.gallery img').length);
      image.src = url;
      image.onload = function() {
        this.width  = this.width * 200/ this.height;
        this.height= 200;
        images[$('.gallery img').length]= Object.assign({},  {"url": url , "width" :  this.width, "height" : this.height });
        clearGallery();
        addImgs();
      }
    } else if (regExpJson.test(url)) {
      getJSON( url ,
        function(err, data) {
          if (err !== null) {
            alert('Something went wrong: ' + err);
          } else {
              data;
            Object.entries(data).forEach(
              ([key, value]) => {
                Object.entries(value).forEach(([key, img]) => {
                  img.width  = img.width * 200/  img.height;
                  img.height = 200;
                  images[$('.gallery img').length + Number(key)]= Object.assign({}, img);
                });      
              }
            );
            clearGallery();
            addImgs();
          }
        });
      }
    } else if ($('.loader-images__input-file').val().split("\\").pop() != ''){
     let uploadFile =  $('.loader-images__input-file').val();
     let inputField = document.getElementById("input");
        if ( regExpImg.test(uploadFile)) {
          if (inputField.files && inputField.files[0]) {
              var reader = new FileReader();
              $(reader).load(function(e) { 
                  let url =e.target.result;
                  let image = new Image();
                  image.classList.add('gallery__img-'+ $('.gallery img').length);
                  image.src = e.target.result;
                  image.onload = function() {
                    this.width  = this.width * 200/ this.height;
                    this.height= 200;
                    images[$('.gallery img').length]= Object.assign({},  {"url": url , "width" :  this.width, "height" : this.height });
                    clearGallery();
                    addImgs();
                  }
                  console.log(images);
              });
              reader.readAsDataURL(inputField.files[0]);
          }
        }
        else if ( regExpJson.test($('.loader-images__input-file').val())) {

          let file = null;
          if (inputField.files && inputField.files[0]) {
              file = new FileReader();
              file.onload = function() {
                console.log(file);
                result =  JSON.parse(file.result);
                  Object.entries(result).forEach(
                    ([key, value]) => {
                      Object.entries(value).forEach(([key, value]) => {
                        value.width  = value.width * 200/  value.height;
                        value.height = 200;
                        images[$('.gallery img').length + Number(key)]= Object.assign({}, value);
                      });                 
                    }
                );
                clearGallery();
                addImgs();
              };
              file.readAsText(inputField.files[0]);
          }
        } else {
          alert("Неправильный формат. Выберете картинку или json файл");
        }
    } else {
      alert("Выберете файл или введите url до файла");
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
    $('.gallery').append(photo); 

  });  
  $('.loader-images__input').val('');
  sizeImages($('.gallery').width() - getIndentForDevice ());
}

function sizeImages(widthScreen ){

  if( document.documentElement.clientWidth >  320  ){
    row = {};
    let needHeight;
    needHeight =200;

    Object.entries(images).forEach(([key, value]) => {
      row[key] = value;
      widthRow += value.width;
      if (widthRow > widthScreen && Object.keys(row).length !== 1 ) { 
        let heightRow = needHeight  * widthScreen/ widthRow;
        let imgToRow = Object.keys(row);
        imgToRow = imgToRow[imgToRow.length -1];       
        Object.entries(row).forEach(([key, img]) => { 

          let width =  img.width * heightRow/ img.height + "px" ;

          if (key != imgToRow  ){
            $('.gallery__img-'+key).css("margin-right", 10/(Object.keys(row).length-1));      
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
            let heightRow = needHeight  * widthScreen/ widthRow;
            heightRow= img.height;
            if (widthScreen < 600 )
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
  $('.gallery img').remove();
}

window.onresize = function(e){
    $('.gallery').css({"width": document.documentElement.clientWidth -25 });
    sizeImages($('.gallery').width() - getIndentForDevice ());  
}

$(document).ready(function () {
  let observer = new MutationObserver(function(mutations) {
    sizeImages($('.gallery').width() - getIndentForDevice ());
  });
  
  let child = document.querySelector('.gallery');
  observer.observe(child, { attributes: true });
 });


