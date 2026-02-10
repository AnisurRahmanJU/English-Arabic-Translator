$(function () {

  // true = Bangla → Arabic | false = Arabic → Bangla
  let bnToAr = true;

  const keyboardDiv = $(".arabic-keyboard");

  // =========================
  // FULL BANGLA KEYBOARD
  // =========================
  const banglaKeys = [
    "অ","আ","ই","ঈ","উ","ঊ","ঋ","এ","ঐ","ও","ঔ",
    "ক","খ","গ","ঘ","ঙ",
    "চ","ছ","জ","ঝ","ঞ",
    "ট","ঠ","ড","ঢ","ণ",
    "ত","থ","দ","ধ","ন",
    "প","ফ","ব","ভ","ম",
    "য","র","ল","শ","ষ","স",
    "হ","য়", "ক্ষ", "ড়", "ঢ়",
    "্","ং","ঃ","ঁ",
    "া","ি","ী","ু","ূ","ৃ","ে","ৈ","ো","ৌ",
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
    // Desktop: 12 keys per row
    // Tablet: 10 keys per row
    // Mobile: 8 keys per row
    const w = window.innerWidth;

    if (w <= 420) return 8;
    if (w <= 768) return 10;
    return 12;
  }

  // =========================
  // RENDER KEYBOARD (PERFECT ALIGNMENT)
  // =========================
  function renderKeyboard(keys) {
    keyboardDiv.empty();

    // Direction fix
    if (bnToAr) {
      keyboardDiv.css({ "direction": "ltr", "justify-content": "flex-start" });
    } else {
      keyboardDiv.css({ "direction": "rtl", "justify-content": "flex-end" });
    }

    const cols = getColumns();

    // Calculate key width (dynamic)
    // Keyboard width is container width
    const kbWidth = keyboardDiv.innerWidth();
    const gap = 6; // your CSS margin approx
    const totalGap = (cols + 1) * gap;
    const keyW = Math.floor((kbWidth - totalGap) / cols);

    // Ensure minimum width (so key never becomes too small)
    const finalKeyW = Math.max(keyW, 36);

    // Add all character keys
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

    // Add Delete X (same size as key)
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

    // Space (full width)
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

  // Initial load Bangla keyboard
  renderKeyboard(banglaKeys);

  // =========================
  // AUTO RESIZE KEYBOARD ON SCREEN RESIZE
  // =========================
  $(window).on("resize", function () {
    if (bnToAr) renderKeyboard(banglaKeys);
    else renderKeyboard(arabicKeys);
  });

  // =========================
  // TRANSLATE BUTTON
  // =========================
  $("#translate").on("click", function () {
    let text = $("#user").val().trim();
    if (text === "") return;

    let sl = bnToAr ? "bn" : "ar";
    let tl = bnToAr ? "ar" : "bn";

    $.getJSON(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`,
      function (data) {
        let translated = data[0][0][0];

        $("#output").val(translated);

        if (bnToAr) {
          $("#bn-out").text(text);
          $("#ar-out").text(translated);
        } else {
          $("#ar-out").text(text);
          $("#bn-out").text(translated);
        }
      }
    );
  });

  // =========================
  // CLEAR BUTTON
  // =========================
  $("#clear").on("click", function () {
    $("#user").val("");
    $("#output").val("");
    $("#bn-out").text("");
    $("#ar-out").text("");
  });

  // =========================
  // SWAP BUTTON
  // =========================
  $("#swap").on("click", function () {

    // Swap textarea values
    let userVal = $("#user").val();
    let outputVal = $("#output").val();
    $("#user").val(outputVal);
    $("#output").val(userVal);

    // Swap output texts
    let bnText = $("#bn-out").text();
    let arText = $("#ar-out").text();
    $("#bn-out").text(arText);
    $("#ar-out").text(bnText);

    // Toggle textarea class
    $("#user, #output").toggleClass("bangla arabic");

    // Swap select options
    let lang1 = $("#lang1 option");
    let lang2 = $("#lang2 option");

    let tempText = lang1.text();
    let tempVal = lang1.val();

    lang1.text(lang2.text()).val(lang2.val());
    lang2.text(tempText).val(tempVal);

    // Toggle translation direction
    bnToAr = !bnToAr;

    // Render correct keyboard
    if (bnToAr) renderKeyboard(banglaKeys);
    else renderKeyboard(arabicKeys);
  });

});
