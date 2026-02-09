

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
     ARABIC KEYBOARD
  ========================== */
  const arabicKeys = [
      "ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض",
      "ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي",
      "ء","ئ","أ","ؤ","لا","ى","ة"
  ];

  const keyboardDiv = $(".arabic-keyboard");

  arabicKeys.forEach(key=>{
      const btn = $("<button>")
        .addClass("key")
        .text(key)
        .on("click", ()=>{
            $("#user").val($("#user").val() + key);
        });

      keyboardDiv.append(btn);
  });

  // SPACE KEY
  const spaceBtn = $("<button>")
    .addClass("space-key")
    .text("SPACE")
    .on("click", ()=>{
        $("#user").val($("#user").val() + " ");
    });

  keyboardDiv.append(spaceBtn);

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
  });

});
