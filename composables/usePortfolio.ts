export const usePortfolio = () => {
    const profile = {
        name: 'ishi720',
        bio: '休日は、無駄なものを開発しているオカメインコです。革新的なアイデアや文化は、無駄から生まれると思ってます。',
        avatar: '/portfolio/images/ishi720_profile.jpeg',
        email: 'ishizuka720@gmail.com',
    }

    const socials = [
        { name: 'GitHub', url: 'https://github.com/ishi720' },
        { name: 'Qiita', url: 'https://qiita.com/ishi720' },
        { name: 'Zenn', url: 'https://zenn.dev/ishi720' },
        { name: 'Note', url: 'https://note.com/ishi720' },
        { name: 'npm', url: 'https://www.npmjs.com/~ishi720' },
        { name: 'LINE Store', url: 'https://store.line.me/stickershop/author/5872119/ja' },
    ]

    const developments = [
        { title: 'ポケモンパーティメーカー', url: 'https://suisui.fun/ppm/', image: 'ppm.png', description: 'ポケモンをランダムで選出します。しりとり選出機能もあります。', techs: ['PHP', 'Javascript'] },
        { title: 'Collatz Visualization', url: 'https://suisui.fun/collatz_visualization/', image: 'collatz_visualization.png', description: '未解決問題のひとつであるコラッツ問題をvis.jsを用いて視覚化しました。', techs: ['Javascript', 'Vue'] },
        { title: "Let's Typo", url: 'https://suisui.fun/make_typo/', image: 'lets_typo.png', description: 'タイポグリセミア現象を使った、文章変換サービスです。', techs: ['Javascript'] },
        { title: '正規表現シミュレーター', url: 'https://suisui.fun/regexp/', image: 'regexp.png', description: 'Angular.jsを利用して作成しました。リアルタイムに正規表現のシミュレーションができます。', techs: ['Javascript', 'Angular'] },
        { title: 'コイントスの統計', url: 'https://ishi720.github.io/cointoss_statistics/dist/', image: 'cointoss_statistics.png', description: 'コイントスのシミュレートし、二項分布のグラフをchart.jsを用いて表現しました。', techs: ['Javascript'] },
        { title: 'Qiitaアナリティクス', url: 'https://qiita-api-sample.onrender.com/', image: 'qiita_analytics.png', description: 'Qiitaの記事を日付ごとの「いいね」数でグラフ化しました。', techs: ['Javascript', 'Python', 'Flask'] },
        { title: 'Numnator', url: 'https://numnator.suisui.fun', image: 'numnator.png', description: '開発途中の数字を当てるゲームです。Vue.jsで作成しています。', techs: ['Javascript', 'Vue'] },
        { title: 'キーボードUI', url: 'https://ishi720.github.io/keyboardUI/', image: 'keyboardUI.png', description: '自作のWEBキーボードです。かな、ローマ字、ハングルの3種類のキーボードを選択できます。', techs: ['Javascript'] },
        { title: '子音チェンジャー', url: 'https://consonant-changer.suisui.fun/', image: 'ConsonantChanger.png', description: '文字の変換ができるサービスです。Go言語のechoフレームワークを使って作成しました。', techs: ['Go', 'Echo'] },
        { title: 'Mechanical Sketcher', url: 'https://ishi720.github.io/mechanical-sketcher/', image: 'mechanical_sketcher.png', description: 'リンク機構の軌道を描画するシミュレーションするプログラムです。p5.jsで作成しました。', techs: ['Javascript'] },
        { title: '正規表現のスキルチェック', url: 'https://regex-challenge.vercel.app/', image: 'regex-challenge.png', description: '正規表現のスキルをチェックできるサービスです。Reactで作成中です。', techs: ['Typescript', 'React'] },
        { title: 'レーベンシュタイン距離の検索機能サンプル', url: 'https://levenshtein-distance-search-silk.vercel.app/', image: 'levenshtein-distance-search.png', description: 'Reactでレーベンシュタイン距離を使った検索機能を実装しました。', techs: ['Typescript', 'React'] },
        { title: '4点を通る正方形を描く', url: 'https://ishi720.github.io/draw_shapes/', image: 'draw_shapes.png', description: 'p5.jsを用いて、移動する4点を通る正方形を描画するプログラムを作成しました。', techs: ['Javascript'] },
        { title: '2048パズル', url: 'https://two048puzzle-1.onrender.com/', image: '2048puzzle.png', description: 'Reactとp5.jsで2048パズルを作成しました。', techs: ['Javascript', 'React'] },
        { title: 'モールス信号シミュレーター', url: 'https://morse-code-simulator-seven.vercel.app/', image: 'morse-code-simulator.png', description: 'モールス信号のシミュレーターをReactで作成しました。', techs: ['Javascript', 'React'] },
        { title: '3Dマインスイーパー', url: 'https://minesweeper3d.suisui.fun/', image: 'MineSweeper3d.png', description: 'Three.jsで3Dマインスイーパーを作成しました。', techs: ['Javascript'] },
        { title: 'WEBラテアート', url: 'https://ishi720.github.io/web-latte-art/', image: 'web-latte-art.png', description: 'ブラウザでラテアートが楽しめる、流体シミュレーションアプリケーションです。', techs: ['Javascript'] },
        { title: 'ラバーペンシル現象', url: 'https://ishi720.github.io/RubberPencilIllusion/', image: 'RubberPencilIllusion.png', description: 'ラバーペンシル現象の錯覚を再現したWebアプリケーションです。', techs: ['Javascript'] },
        { title: '4目並べ', url: 'https://play.unity.com/ja/games/d623ce55-a4fa-44f6-9733-d2912f7c07df/connect4', image: 'connect4.png', description: 'Unityで作成した4目並べです。', techs: ['C#', 'Unity'] },
        { title: 'ハニカム構造マインスイパー', url: 'https://ishi720.github.io/MineSweeperHoneycomb/', image: 'MineSweeperHoneycomb.png', description: 'ハニカム構造のマインスイーパーです。', techs: ['Javascript'] },
        { title: 'ハニカム構造リバーシ', url: 'https://ishi720.github.io/HoneycombReversi/', image: 'HoneycombReversi.png', description: 'ハニカム構造リバーシです。CPUも実装しています。', techs: ['Javascript', 'React'] },
        { title: 'Honeycomb Pixel Art', url: 'https://honeycomb-pixel-art.vercel.app/', image: 'HoneycombPixelArt.png', description: '画像ファイルをハニカムピクセルに変換するサービスです。', techs: ['Javascript', 'React'] },
        { title: 'Polygonal Geometric Pattern', url: 'https://ishi720.github.io/PolygonalGeometricPattern/', image: 'PolygonalGeometricPattern.png', description: '多角形の辺上を移動する点から生成される幾何学的パターンを可視化するサービスです。', techs: ['Javascript'] },
        { title: 'ReuleauxPhysics', url: 'https://ishi720.github.io/ReuleauxPhysics/', image: 'ReuleauxPhysics.png', description: 'ルーローの三角形の物理シミュレーションです。', techs: ['Javascript'] },
        { title: 'Tech Catalog', url: 'https://ishi720.github.io/tech-catalog/', image: 'tech-catalog.png', description: 'プログラミング技術一覧をまとめたサービスです。', techs: ['Javascript', 'Nuxt', 'Vue'] },
    ]

    const chromeExtensions = [
        { title: 'Feeduck', url: 'https://chromewebstore.google.com/detail/feeduck/alfjohbjhjgkcmgecbhjcjhhkiphccne?authuser=4&hl=ja', image: 'feeduck-chrome-extension.png', description: 'RSSフィードを表示するChrome拡張機能です。', techs: ['Javascript'] },
    ];

    const lineStamps = [
        { title: 'うちのドラム式', url: 'https://store.line.me/stickershop/product/32539347/ja', image: 'linestamp_DrumType.png', description: 'ドラム式洗濯機のキャラクターです。 見ての通りマイペースです。' },
    ];

    const npmPackages = [
        {
            name: 'jquery-textfit',
            url: 'https://www.npmjs.com/package/jquery-textfit',
            github: 'https://github.com/ishi720/jquery-textfit',
            description: 'textfitjsのjQuery版。要素からはみ出た文字を削って省略記号をつけるjQueryプラグインです。',
            techs: ['Javascript', 'jQuery'],
            version: '1.1.1'
        },
        {
            name: 'gulp-package-version-format',
            url: 'https://www.npmjs.com/package/gulp-package-version-format',
            github: 'https://github.com/ishi720/gulp-package-version-format',
            description: 'Gulpプラグイン。package.jsonのバージョンを指定された形式で更新できます。',
            techs: ['Javascript', 'Gulp'],
            version: '1.6.1'
        },
        {
            name: 'pake-style',
            url: 'https://www.npmjs.com/package/pake-style',
            github: 'https://github.com/ishi720/pake-style',
            description: '時間差で順番に動いていくアニメーションのスタイルです。',
            techs: ['CSS'],
            version: '1.0.5'
        },
        {
            name: 'textfit',
            url: 'https://www.npmjs.com/package/textfitjs',
            github: 'https://github.com/ishi720/textfitJS',
            description: '要素からはみ出た文字を削って省略記号をつけるJavaScriptライブラリです。',
            techs: ['Javascript'],
            version: '2.0.1'
        },
        {
            name: 'gaming-css',
            url: 'https://www.npmjs.com/package/gaming-css',
            github: 'https://github.com/ishi720/gaming-css',
            description: 'ゲーミングなスタイリングするCSSです',
            techs: ['CSS'],
            version: '1.0.2'
        },

    ]

    const skills = [
        { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', level: 90 },
        { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', level: 90 },
        { name: 'Javascript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', level: 80 },
        { name: 'Python3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', level: 50 },
        { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg', level: 60 },
        { name: 'Ruby', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg', level: 20 },
        { name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg', level: 20 },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', level: 10 },
    ]

    const article_platforms = [
        { title: 'Qiita', url: 'https://qiita.com/ishi720'},
        { title: 'Zenn', url: 'https://zenn.dev/ishi720'},
    ]

  return { profile, socials, developments, chromeExtensions, lineStamps, npmPackages, skills, article_platforms }
}