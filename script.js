function calculate() {
    // 1. HTML要素からユーザー入力値を取得
    const raidSelect = document.getElementById("raid-select");
    const targetProbabilityInput = document.getElementById("target-probability");
    const resultsDiv = document.getElementById("results");

    // 入力値のバリデーション
    const targetProb = parseFloat(targetProbabilityInput.value);
    if (isNaN(targetProb) || targetProb <= 0 || targetProb > 100) {
        resultsDiv.innerHTML = "<p>無効な確率です。1から100の間の数値を入力してください。</p>";
        return;
    }

    // 2. 選択されたレイドに基づいて計算に必要な変数を設定
    let dropRate;
    let avgSubDrops;
    let mainResultText;
    let subResultText;
    const isTsuyobaha = raidSelect.value === "tsuyobaha";

    switch (raidSelect.value) {
        case "tsuyobaha":
            dropRate = 0.02;
            avgSubDrops = 2; // 紫電角
            mainResultText = "後青箱を『<span class='result-highlight'>{}</span>』回落としてください。";
            subResultText = "紫電角が『<span class='result-highlight'>{}</span>』個増える程度の周回数です。";
            break;
        case "albahha":
            dropRate = 0.0005;
            avgSubDrops = 2.5; // オメガユニット
            mainResultText = "後『<span class='result-highlight'>{}</span>』回倒してください。";
            subResultText = "オメガユニットが『<span class='result-highlight'>{}</span>』個増える程度の周回数です。";
            break;
        case "grande":
            dropRate = 0.002;
            avgSubDrops = 1.5; // 蒼翠の結晶
            mainResultText = "後『<span class='result-highlight'>{}</span>』回倒してください。";
            subResultText = "蒼翠の結晶（トゲトゲ）が『<span class='result-highlight'>{}</span>』個増える程度の周回数です。";
            break;
        case "akasha":
            dropRate = 0.002;
            avgSubDrops = 2; // 虚ろなる鍵
            mainResultText = "後『<span class='result-highlight'>{}</span>』回倒してください。";
            subResultText = "虚ろなる鍵が『<span class='result-highlight'>{}</span>』個増える程度の周回数です。";
            break;
    }

    // 3. 計算ロジックの適用
    const targetProbDecimal = targetProb / 100;
    
    // ヒヒが当たる確率が100%になるには、計算上は無限大になるので、その場合は特別なメッセージを表示する
    if (targetProbDecimal >= 1) {
        resultsDiv.innerHTML = `<p>100%の確率でドロップさせるには、理論上は無限回の周回が必要です。</p><p>現実的には、非常に多くの周回でほぼ確実にドロップします。</p>`;
        return;
    }
    
    // 必要な周回数（または青箱の数）を計算
    const requiredRuns = Math.ceil(Math.log(1 - targetProbDecimal) / Math.log(1 - dropRate));
    
    // 4. 副産物の期待値計算
    const expectedSubDrops = requiredRuns * avgSubDrops;

    // 5. 結果の表示
    // HTMLテンプレート内のプレースホルダーを計算結果で置き換える
    const mainResult = mainResultText.replace("{}", requiredRuns);
    const subResult = subResultText.replace("{}", expectedSubDrops.toFixed(2).replace(/\.00$/, '')); // 小数点以下2桁に丸め、末尾の.00を削除
    
    resultsDiv.innerHTML = `<p>${mainResult}</p><p>${subResult}</p>`;

    // 補足情報：ユーザー入力された「すでに周回した数」と「落ちたヒヒ」は使用しない
    // ご要望通り、計算に含めない旨を明記
    document.getElementById("current-runs").disabled = false;
    document.getElementById("hisi-drops").disabled = false;
}