import rainhutapi from "./rainhutapi";
import RainhutTacoConfig from "./../RainhutTacoConfig";
import SampleData from "./sampleData";
const sampleBookEntries = {
  setup: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 50,
    paddingBottom: 50,
    headerHeight: 20,
    footerHeight: 20,
    columnSpacing: 40,
    entrySpacing: 10,
    cropMarginLeft: 0,
    cropMarginRight: 0,
    cropMarginBottom: 0,
    cropMarginTop: 0,
    width: 1000,
    height: 800,
    birthday: "2017-08-11",
    titleStyle: {
      textColor: "#333333",
      fontFamily: "Roboto",
      size: 1,
      weight: "bold"
    },
    contentStyle: {
      textColor: "#999999",
      fontFamily: "Roboto",
      size: 0.8,
      weight: ""
    },
    footerStyle: {
      textColor: "#333333",
      fontFamily: "Roboto",
      size: 1,
      weight: ""
    },
    dateStyle: {
      textColor: "#999999",
      fontFamily: "Roboto",
      size: 0.4,
      weight: ""
    },
    headerStyle: {
      textColor: "#333333",
      fontFamily: "Roboto",
      size: 1,
      weight: ""
    },
    cropImage: true,
    fitImagesRule: "med",
    imageClass: "",
    randomImageEffect: false,
    backgroundImage: "",
    rotateAmount: 0,
    borderColor: "#e2e2e2",
    borderWidth: 4,
    minimumDpi: 90,
    highResDpi: 150,

    minTextFullPage: 660,
    alignItems: "flex-start",
    justifyItems: "center",
    titleTextAlign: "center",
    contentTextAlign: "justify",
    dateTextAlign: "right",
    imageAlign: "50% 50%",
    dateFormat: "plain",
    fixForReturn: true,
    doCaptions: false,
    combineCaptions: false
  },
  entries: []
};

generateSampleEntries = () => {
  var lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lobortis, velit eget rutrum molestie, erat leo cursus lacus, eu pellentesque leo erat eget purus. Etiam imperdiet condimentum lacus sit amet blandit. Interdum et malesu  ada fames ac ante ";
  var lorem2 = "Praesent arcu tortor, viverra ac eleifend et, euismod sed.";
  var images = [];

  //lorem = lorem.substr(0, 55)

  for (var i = 0; i < 1; i++) {
    //   images.push("");
  }
  for (var i = 0; i < 10; i++) {
    var highRes = Math.floor(Math.random() * 4);
    var min = 550;
    var max = 900;

    var width = Math.floor(Math.random() * max) + min;
    var height = Math.floor(Math.random() * max) + min;

    var widthActual = width;
    var heightActual = height;
    if (highRes == 1) {
      // widthActual = width*4;
      // heightActual = height*4;
    }

    if (width % 2 != 0) {
      width -= 1;
    }
    if (height % 2 != 0) {
      height -= 1;
    }
    var square = Math.floor(Math.random() * 2) + 1;
    if (square == 1) {
      var tmp = height;
      height = width;
      width = tmp;
    }
    images.push(
      "https://source.unsplash.com/random/" + width + "x" + height + "?sig=" + i
    );
  }
  var itemsCount = 15;
  var entries = [];
  for (var i = 0; i < itemsCount; i++) {
    var contentLength = Math.floor(Math.random() * lorem.length);
    var content = lorem.substr(0, contentLength);

    var titleLength = Math.floor(Math.random() * lorem2.length);
    var title = lorem.substr(0, titleLength);

    var imgIdx = Math.floor(Math.random() * images.length);
    var image = images[imgIdx];

    var item = {};

    /* if(image == "") {
      item.title = title;
      item.content = content;
    }
    else {
      item.title = ""//title;
      item.content = ""//content;
    }
    */
    item.title = title;
    item.content = content;
    var noText = Math.floor(Math.random() * 4) + 1;
    if (noText == 1) {
      item.title = "";
      item.content = "";
    } else if (noText == 2) {
      item.image = "";
    }

    item.image = image;
    item.imageWidth = widthActual;
    item.imageHeight = heightActual;
    item.date = "- entry footer";
    item.footer = "Page Footer";
    item.header = "Page Header";
    entries.push(item);
  }
  return entries;
};

export const RainhutCreateBook = (entries, successBlock, errorBlock) => {
  if (entries == null) {
    entries = generateSampleEntries();
  }
  var api = new rainhutapi(
    RainhutTacoConfig.apiSecretKey,
    RainhutTacoConfig.apiPublicKey
  );
  //sample entries... sample setup
  //api.createBook(entries, sampleBookEntries.setup, successBlock);
  var sample = SampleData.sample1;
  sample.setup.fixForReturn = true;
  api.createBook(getsampleEntries2(), sample.setup, successBlock);
  //api.createBook(null, null, successBlock);
};

export const RainhutUpdateBook = (
  book,
  currentBookIdx,
  allPages,
  layoutToBestFit,
  successCallback
) => {
  var book2 = JSON.parse(JSON.stringify(book));
  if (allPages == true) {
    book2.layoutToBestFit = true;
  } else {
    var page = book2.pages[currentBookIdx];
    book2.pages = [page];
    book2.layoutToBestFit = layoutToBestFit;
  }

  var api = new rainhutapi(
    RainhutTacoConfig.apiSecretKey,
    RainhutTacoConfig.apiPublicKey
  );
  api.updateBook(book2, successCallback);
};

export const RainhutUploadBook = (book, successCallback) => {
  var book2 = JSON.parse(JSON.stringify(book));
  var api = new rainhutapi(
    RainhutTacoConfig.apiSecretKey,
    RainhutTacoConfig.apiPublicKey
  );
  api.uploadBook(book2, successCallback);
};

function getEntriesFromPages(pages) {
  var entries = [];
  for (var i = 0; i < pages.length; i++) {
    var pageEntries = pages[i].entries;
    for (var j = 0; j < pageEntries.length; j++) {
      var pageEntry = pageEntries[j];
      console.log(pageEntry);
      pageEntry.author = "joe";
      // if(pageEntry.answer.includes("Today")) {
      entries.push(pageEntry);
      // }
    }
  }
  for (var i = 0; i < entries.length; i++) {
    var highRes = Math.floor(Math.random() * 4);
    var min = 550;
    var max = 900;

    var width = Math.floor(Math.random() * max) + min;
    var height = Math.floor(Math.random() * max) + min;
    if (highRes == 1) {
      width = width * 4;
      height = height * 4;
    }
    var square = Math.floor(Math.random() * 2) + 1;
    if (square == 1) {
      var tmp = height;
      height = width;
      width = tmp;
    }
    var entry = entries[i];
    if (entry.image != undefined && entry.image != "") {
      entry.image =
        "https://source.unsplash.com/random/" + width + "x" + height;
      entry.imageWidth = width;
      entry.imageHeight = height;
    }
  }
  return entries;
}

function getsampleEntries2() {
  var entries = getEntriesFromPages(SampleData.sample1.pages);
  return entries;
}
