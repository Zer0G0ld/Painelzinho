//Read all localstorage data
function getLocalStorage() {
  var a = {};
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    var v = localStorage.getItem(k);
    a[k] = v;
  }
  var s = JSON.stringify(a);
  return s;
}

//Save data to localStorage
function writeLocalStorage(data) {
  var o = JSON.parse(data);
  for (var property in o) {
    if (o.hasOwnProperty(property)) {
      localStorage.setItem(property, o[property]);
    }
  }
  location.reload();
}

//Copy all data to clipboard
function exportData() {
  var allData = getLocalStorage();
  document.getElementById("dataInput").value = allData;
  var copyText = document.getElementById("dataInput");

  //Open the Popup "Copied to Clipboard"
  openExportPopup();

  //Select text input and copy to the clipboard
  copyText.select();
  document.execCommand("copy");
}

function loadData() {
  $(".storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);
    var default_value = $(this).attr("value");

    if (value) {
      $(this).val(value);
    } else if (default_value) {
      $(this).val(default_value);
    }
  });

  $(".logo-storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);
    if (value != "undefined" && value != "") {
      $(this).attr("src", value);
    } else {
      //Set all to default the first time
      if (id == "alt-1-logo-preview" || id == "alt-1-logo-default") {
        $(this).attr("src", alt_1_logo_default);
      }
      if (id == "alt-2-logo-preview" || id == "alt-2-logo-default") {
        $(this).attr("src", alt_2_logo_default);
      }
      if (id == "alt-3-logo-preview" || id == "alt-3-logo-default") {
        $(this).attr("src", alt_3_logo_default);
      }
      if (id == "alt-4-logo-preview" || id == "alt-4-logo-default") {
        $(this).attr("src", alt_4_logo_default);
      }
    }
  });

  $(".slot-storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);

    $(this).text(value);
  });

  $(".checkbox-storable, .radio-storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);

    if (value) {
      $(this).prop("checked", localStorage.getItem(id) === "true");
    }
  });

  $(".title-storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);

    if (value) {
      $(this).text(value);
    }
  });
}

function saveData() {
  // If local storage is empty, call reset to reinitialize
  if (localStorage.length === 0) {
    okResetPopup();
  }

  $(".storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    var value = $(this).val();
    localStorage.setItem(id, value);
  });

  // Update while input (text or number) is changed
  $(":input[type=text], :input[type=number]").on("input", function (e) {
    refreshData();
    var id = $(this).attr("id");
    var value = $(this).val();
    localStorage.setItem(id, value);
  });

  $(".logo-storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    var value = $(this).attr("src");
    localStorage.setItem(id, value);
  });

  $(".slot-storable, .title-storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    var value = $(this).text();
    localStorage.setItem(id, value);
  });

  $(".checkbox-storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    localStorage.setItem(id, $(this).is(":checked"));

    // Check for a twin chekcbox
    if ($(this).hasClass("twin-checkbox")) {
      const twin = $(this)
        .parents(".grid-row")
        .find(".twin-checkbox")
        .not(this);
      id = twin.attr("id");
      localStorage.setItem(id, twin.is(":checked"));
    }
  });

  $(".radio-storable").change(function () {
    refreshData();
    var radio_name = $(this).attr("name");
    $(":input[name=" + radio_name + "]").each(function () {
      var id = $(this).attr("id");
      localStorage.setItem(id, $(this).is(":checked"));
    });
  });

  $(".font-storable, .select-settings-storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    localStorage.setItem(id, this.value);
  });

  /**
   * Indirect changes
   */
  $(":button").on("click", function (e) {
    // Lanza evento de cambio del input superior
    $(this).parent().find("input").change();
  });

  $(".slot-number").on("click", function (e) {
    // Lanza evento de cambio de los divs hermanos
    $(this).siblings(".slot-storable").change();
  });
}