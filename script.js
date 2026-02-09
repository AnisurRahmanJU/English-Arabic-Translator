

$(function(){

  // Track translation direction: true = Bangla → Arabic, false = Arabic → Bangla
  let bnToAr = true;

  // Translate button
  $("#translate").on("click", function(){
      let text = $("#user").val().trim();
      if(text === "") return;

      // Set source (sl) and target (tl) languages dynamically
      let sl = bnToAr ? "bn" : "ar";
      let tl = bnToAr ? "ar" : "bn";

      $.getJSON(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`,
          function(data){
              let translated = data[0][0][0];

              // Update textareas and output
              $("#output").val(translated);

              if(bnToAr){
                  $("#ar-out").text(translated);
                  $("#bn-out").text(text);
              } else {
                  $("#bn-out").text(translated);
                  $("#ar-out").text(text);
              }
          }
      );
  });

  // Clear button
  $("#clear").on("click", function(){
      $("#user").val('');
      $("#output").val('');
      $("#ar-out").text('');
      $("#bn-out").text('');
  });

  // Arabic keyboard
  const arabicKeys = [
      "ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض",
      "ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي","ء","ئ","أ","ؤ","لا","ى","ة"
  ];

  const keyboardDiv = $(".arabic-keyboard");
  arabicKeys.forEach(key=>{
      const btn = $("<button>").text(key).on("click", ()=>{
          let current = $("#user").val();
          $("#user").val(current + key);
      });
      keyboardDiv.append(btn);
  });

  // ----------------------------
  // SWAP TEXTAREAS + OUTPUTS + SELECT OPTIONS
  // ----------------------------
  $("#swap").on("click", function(){
      // Swap textareas
      let userVal = $("#user").val();
      let outputVal = $("#output").val();
      $("#user").val(outputVal);
      $("#output").val(userVal);

      // Swap output boxes
      let bnOut = $("#bn-out").text();
      let arOut = $("#ar-out").text();
      $("#bn-out").text(arOut);
      $("#ar-out").text(bnOut);

      // Swap fonts/direction
      $("#user").toggleClass("bangla arabic");
      $("#output").toggleClass("bangla arabic");

      // Swap select options visually
      let lang1Val = $("#lang1 option").val();
      let lang1Text = $("#lang1 option").text();
      let lang2Val = $("#lang2 option").val();
      let lang2Text = $("#lang2 option").text();
      $("#lang1 option").val(lang2Val).text(lang2Text);
      $("#lang2 option").val(lang1Val).text(lang1Text);

      // Toggle translation direction
      bnToAr = !bnToAr;
  });

}); 
