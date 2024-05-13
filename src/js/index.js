$(document).ready(function () {
  // Language Select ボックスの変更を検知
  $(".language-select select").on("change", function () {
    var selectedCategory = $(this).val(); // 選択されたカテゴリーの値を取得

    $(".person-card").hide(); // すべてのカードを非表示にする
    if (selectedCategory === "all") {
      $(".person-card").show(); // 全てのカードを表示
    } else {
      // data-category属性が選択されたカテゴリーに一致するカードのみを表示
      $('.person-card[data-category="' + selectedCategory + '"]').show();
    }
  });

  // Sort Select ボックスの変更を検知
  $(".sort-select select").change(function () {
    var sortBy = $(this).val(); // 選択されたソートオプションの取得
    var container = $(".grid"); // カードを含むコンテナの選択
    var cards = $(".person-card").toArray(); // カードの配列化

    // ソート処理
    cards.sort(function (a, b) {
      var aValue, bValue;

      switch (parseInt(sortBy)) {
        case 1: // おすすめ順
          aValue = $(a).data("related");
          bValue = $(b).data("related");
          return aValue - bValue;
        case 2: // 価格昇順
          aValue = parseInt($(a).data("price"), 10);
          bValue = parseInt($(b).data("price"), 10);
          return aValue - bValue;
        case 3: // 価格降順
          aValue = parseInt($(a).data("price"), 10);
          bValue = parseInt($(b).data("price"), 10);
          return bValue - aValue;
        case 4: // 登録日順
          aValue = new Date($(a).data("registed"));
          bValue = new Date($(b).data("registed"));
          return aValue - bValue;
        default:
          return 0; // No sorting
      }
    });

    // ソート後のカードをコンテナに再配置
    cards.forEach(function (card) {
      container.append(card); // これによりDOM上で順番が更新される
    });
  });

  // テキスト入力の変更を検知
  $('input[type="text"]').on("input", function () {
    const searchQuery = $(this).val().toLowerCase();
    $(".tutor-name").each(function () {
      const itemText = $(this).text().toLowerCase();
      if (itemText.includes(searchQuery)) {
        $(this).closest(".person-card").show(); // 検索に一致する場合はカードを表示
      } else {
        $(this).closest(".person-card").hide(); // 一致しない場合はカードを非表示
      }
    });
  });

  // Range スライダーの変更を検知
  $('input[type="range"]').on("input", function () {
    var currentPrice = parseInt($(this).val(), 10);
    $("#price-label").text(currentPrice + "円"); // スライダーの値を表示

    $(".person-card").each(function () {
      var cardPrice = parseInt($(this).data("price"), 10);
      if (cardPrice >= currentPrice) {
        $(this).show(); // カードの価格がスライダーの値以上なら表示
      } else {
        $(this).hide(); // それ以外は非表示
      }
    });
  });

  // スライダーのポップアップを更新
  function updateSliderPopup(value) {
    const popup = $("#price-popup");
    const slider = $("#price-range");
    const sliderWidth = slider.width();
    const min = slider.attr("min");
    const max = slider.attr("max");
    const newPosition = Number(((value - min) * 100) / (max - min));
    const popupWidth = popup.outerWidth();
    const offset = (newPosition / 100) * sliderWidth - popupWidth / 2;

    // スライダーの端でポップアップが親要素をはみ出さないように調整
    let adjustedLeft = offset;
    if (offset < 0) {
      adjustedLeft = 0; // 左端を超えないように
    } else if (offset + popupWidth > sliderWidth) {
      adjustedLeft = sliderWidth - popupWidth; // 右端を超えないように
    }

    popup.css("left", `${adjustedLeft}px`).text(`${value}円`).show();
  }

  $("#price-range")
    .on("input", function () {
      updateSliderPopup($(this).val());
    })
    .trigger("input"); // Initialize popup position on page load

  $("#price-range").on("mouseleave", function () {
    $("#price-popup").hide();
  });

  // Date picker の変更を検知
  $('input[type="date"]').on("change", function () {
    console.log(`Date selected: ${this.value}`);
  });

  $(".lesson-btn").on("click", function () {
    // 親要素のperson-cardを検索して、そのdata-idを取得
    var cardId = $(this).closest(".person-card").data("id");
    const url = `lesson.html?roomName=${cardId}`; // URLにIDを付加
    window.open(url, "_blank"); // 新しいタブで通話ページを開く
  });
});
