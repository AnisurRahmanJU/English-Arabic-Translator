$(function () {

  // true = English → Arabic | false = Arabic → English
  let enToAr = true;

  const keyboardDiv = $(".arabic-keyboard");

  // =========================
  // FULL ENGLISH KEYBOARD
  // =========================
  const englishKeys = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z",
    
  ];

  // =========================
  // ARABIC KEYBOARD
  // =========================
  const arabicKeys = [
    "ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض",
    "ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي",
    "ء","ئ","أ","ؤ","لا","ى","ة"
  ];

  // =========================
  // FIXED KEY SIZE SYSTEM
  // =========================
  function getColumns() {
    const w = window.innerWidth;
    if (w <= 420) return 8;
    if (w <= 768) return 10;
    return 12;
  }

  // =========================
  // RENDER KEYBOARD
  // =========================
  function renderKeyboard(keys) {
    keyboardDiv.empty();

    if (enToAr) {
      keyboardDiv.css({ "direction": "ltr", "justify-content": "flex-start" });
    } else {
      keyboardDiv.css({ "direction": "rtl", "justify-content": "flex-end" });
    }

    const cols = getColumns();
    const kbWidth = keyboardDiv.innerWidth();
    const gap = 6;
    const totalGap = (cols + 1) * gap;
    const keyW = Math.floor((kbWidth - totalGap) / cols);
    const finalKeyW = Math.max(keyW, 36);

    keys.forEach((key) => {
      const btn = $("<button>")
        .addClass("key")
        .text(key)
        .css({
          width: finalKeyW + "px",
          height: "44px",
          margin: "3px",
          flex: "0 0 auto"
        })
        .on("click", () => {
          $("#user").val($("#user").val() + key);
        });

      keyboardDiv.append(btn);
    });

    // Delete button
    const delBtn = $("<button>")
      .addClass("delete-key")
      .text("X")
      .css({
        width: finalKeyW + "px",
        height: "44px",
        margin: "3px",
        flex: "0 0 auto"
      })
      .on("click", () => {
        let val = $("#user").val();
        $("#user").val(val.slice(0, -1));
      });

    keyboardDiv.append(delBtn);

    // Space button
    const spaceBtn = $("<button>")
      .addClass("space-key")
      .text("SPACE")
      .css({
        width: "100%",
        height: "46px",
        margin: "6px 3px 3px 3px",
        flex: "0 0 100%"
      })
      .on("click", () => {
        $("#user").val($("#user").val() + " ");
      });

    keyboardDiv.append(spaceBtn);
  }

  // Initial load English keyboard
  renderKeyboard(englishKeys);

  // Auto resize
  $(window).on("resize", function () {
    if (enToAr) renderKeyboard(englishKeys);
    else renderKeyboard(arabicKeys);
  });

  // Translate button
  $("#translate").on("click", function () {
    let text = $("#user").val().trim();
    if (text === "") return;

    let sl = enToAr ? "en" : "ar";
    let tl = enToAr ? "ar" : "en";

    $.getJSON(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`,
      function (data) {
        let translated = data[0][0][0];

        $("#output").val(translated);

        if (enToAr) {
          $("#en-out").text(text);
          $("#ar-out").text(translated);
        } else {
          $("#ar-out").text(text);
          $("#en-out").text(translated);
        }
      }
    );
  });

  // Clear button
  $("#clear").on("click", function () {
    $("#user").val("");
    $("#output").val("");
    $("#en-out").text("");
    $("#ar-out").text("");
  });

  // Swap button
  $("#swap").on("click", function () {
    let userVal = $("#user").val();
    let outputVal = $("#output").val();
    $("#user").val(outputVal);
    $("#output").val(userVal);

    let enText = $("#en-out").text();
    let arText = $("#ar-out").text();
    $("#en-out").text(arText);
    $("#ar-out").text(enText);

    $("#user, #output").toggleClass("english arabic");

    let lang1 = $("#lang1 option");
    let lang2 = $("#lang2 option");
    let tempText = lang1.text();
    let tempVal = lang1.val();
    lang1.text(lang2.text()).val(lang2.val());
    lang2.text(tempText).val(tempVal);

    enToAr = !enToAr;

    if (enToAr) renderKeyboard(englishKeys);
    else renderKeyboard(arabicKeys);
  });

});
