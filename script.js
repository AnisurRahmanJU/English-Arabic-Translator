$(function(){

  // true = Bangla → Arabic | false = Arabic → Bangla
  let bnToAr = true;

  /* =========================
     TRANSLATE
  ========================== */
  $("#translate").on("click", function(){
      let text = $("#user").val().trim();
      if(text === "") return;

      let sl = bnToAr ? "bn" : "ar";
      let tl = bnToAr ? "ar" : "bn";

      $.getJSON(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`,
        function(data){
            let translated = data[0][0][0];

            $("#output").val(translated);

            if(bnToAr){
                $("#bn-out").text(text);
                $("#ar-out").text(translated);
            } else {
                $("#ar-out").text(text);
                $("#bn-out").text(translated);
            }
        }
      );
  });

  /* =========================
     CLEAR
  ========================== */
  $("#clear").on("click", function(){
      $("#user").val("");
      $("#output").val("");
      $("#bn-out").text("");
      $("#ar-out").text("");
  });

  /* =========================
     KEYBOARDS
  ========================== */
  const arabicKeys = [
      "ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض",
      "ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي",
      "ء","ئ","أ","ؤ","لا","ى","ة"
  ];

  const banglaKeys = [
      "অ","আ","ই","ঈ","উ","ঊ","এ","ঐ","ও","ঔ",
      "ক","খ","গ","ঘ","ঙ",
      "চ","ছ","জ","ঝ","ঞ",
      "ট","ঠ","ড","ঢ","ণ",
      "ত","থ","দ","ধ","ন",
      "প","ফ","ব","ভ","ম",
      "য","র","ল","শ","ষ","স","হ","ড়","ঢ়","য়",
      "ং","ঃ","ঁ","্","া","ি","ী","ু","ূ","ে","ৈ","ো","ৌ","্র","ৗ"
  ];

  const keyboardDiv = $(".arabic-keyboard"); // single div for both keyboards

  function renderKeyboard(isBangla){
      keyboardDiv.empty(); // clear old keys
      const keys = isBangla ? banglaKeys : arabicKeys;

      // Keyboard keys
      keys.forEach(key=>{
          const btn = $("<button>")
            .addClass("key")
            .text(key)
            .css({"flex":"1 1 7%", "margin":"2px"})
            .on("click", ()=>{
                $("#user").val($("#user").val() + key);
            });
          keyboardDiv.append(btn);
      });

      // Single DELETE X button at the **right side**
      const delBtn = $("<button>")
        .addClass("key delete-key")
        .text("X")
        .css({
            "flex":"1 1 7%",
            "margin":"2px",
            "background":"rgba(239,68,68,0.6)"
        })
        .on("click", ()=>{
            let val = $("#user").val();
            $("#user").val(val.substring(0,val.length-1)); // remove last char
        });
      keyboardDiv.append(delBtn);

      // Space key (separate row)
      const spaceBtn = $("<button>")
        .addClass("space-key")
        .text("SPACE")
        .on("click", ()=>{
            $("#user").val($("#user").val() + " ");
        });
      keyboardDiv.append(spaceBtn);
  }

  // Initial keyboard (Bangla)
  renderKeyboard(true);

  /* =========================
     SWAP LANGUAGES
  ========================== */
  $("#swap").on("click", function(){

      // Swap textarea values
      let userVal = $("#user").val();
      let outputVal = $("#output").val();
      $("#user").val(outputVal);
      $("#output").val(userVal);

      // Swap output boxes
      let bnText = $("#bn-out").text();
      let arText = $("#ar-out").text();
      $("#bn-out").text(arText);
      $("#ar-out").text(bnText);

      // Swap textarea fonts & direction
      $("#user, #output").toggleClass("bangla arabic");

      // Swap select text (visual)
      let lang1 = $("#lang1 option:selected");
      let lang2 = $("#lang2 option:selected");
      let tempText = lang1.text();
      let tempVal  = lang1.val();
      lang1.text(lang2.text()).val(lang2.val());
      lang2.text(tempText).val(tempVal);

      // Toggle direction flag
      bnToAr = !bnToAr;

      // Render correct keyboard
      renderKeyboard(bnToAr);
  });

});
