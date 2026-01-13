export interface Project {
    name: string           // プロジェクト名
    description: string    // 内容
    period: string         // 期間
    techs: string[]        // 技術タグ
    industry: string       // 業界
}

export interface Company {
    name: string           // 会社名
    period: string         // 在籍期間
    position?: string      // 役職（オプション）
    projects: Project[]    // プロジェクト一覧
}

export const useCareer = () => {
    const careers: Company[] = [
        {
            name: '会社E',
            period: '',
            position: 'フルスタックエンジニア',
            projects: [
                {
                    name: 'システムの運用・保守',
                    description: '',
                    period: '',
                    techs: ['PHP', 'MySQL', 'JavaScript', 'Linux'],
                    industry: '人材'
                }
            ]
        },
        {
            name: '会社D',
            period: '',
            position: 'バックエンドエンジニア',
            projects: [
                {
                    name: '基幹システムの機能追加',
                    description: '短期間ですが、スポットで設計や開発のサポートに入りました。',
                    period: '',
                    techs: ['Java8', 'Infra-mart', 'a5m2', 'eBuilder', 'OracleDB'],
                    industry: '製造'
                },
                {
                    name: 'アクセス分析基盤の作成',
                    description: 'メルマガサービスのアクセス分析基盤をQuickSightで構築しました。',
                    period: '',
                    techs: ['Python', 'Lambda', 'S3', 'CloudWatch', 'QuickSight', 'Athena', 'Glue'],
                    industry: '公共'
                },
                {
                    name: 'メルマガサービスの移行作業',
                    description: 'PHPバージョンアップ、AkamaiやCloudFrontのルーティング変更作業を行いました。',
                    period: '',
                    techs: ['PHP', 'MariaDB', 'JavaScript', 'S3', 'SES', 'CloudWatch', 'Postfix', 'Linux', 'Akamai', 'CloudFront'],
                    industry: '公共'
                }
            ]
        },
        {
            name: '会社C',
            period: '',
            position: 'フルスタックエンジニア',
            projects: [
                {
                    name: '見守りサービスの開発',
                    description: 'Line APIを使った見守りサービスを新規プロジェクトとして要件定義から行い実際に実証実験を行う企画まで携わりました。',
                    period: '',
                    techs: ['Python', 'Flask', 'Git', 'PostgreSQL', 'Almalinux', 'Nginx', 'Line API'],
                    industry: '介護'
                },
                {
                    name: '学生データ分析基盤の構築',
                    description: 'データ分析基盤の構築で、データレイク・データウェアハウス・データマート間のバッチ処理を設計から開発までを担当しました。',
                    period: '',
                    techs: ['Python', 'Git', 'SVN', 'PostgreSQL', 'Redshift', 'lambda', 'S3', 'Glue', 'Aurora', 'GithubActions'],
                    industry: '教育'
                },
                {
                    name: '業務内容のDX化',
                    description: '紙での業務フローをGoogle Workspaceを用いて最適化&自動化しました。',
                    period: '',
                    techs: ['Google Workspace', 'Google Apps Script', 'Google Sheets', 'Google Drive', 'Chrome books'],
                    industry: '公共'
                },
                {
                    name: '開発基盤の構築・整備',
                    description: '自社開発のスタートアップとして、ローコードで開発を行うための技術調査や開発手法など基盤を整えました。',
                    period: '',
                    techs: ['OutSystems', 'JavaScript'],
                    industry: 'IT・インフラ'
                }
            ]
        },
        {
            name: '会社B',
            period: '',
            position: 'フルスタックエンジニア',
            projects: [
                {
                    name: '金融関係の顧客管理システムの開発・運用・保守',
                    description: 'PMとしてプロジェクトマネジメントやクライアントの窓口を任されました。',
                    period: '',
                    techs: ['Java', 'HTML', 'JavaScript', 'CSS', 'Eclipse', 'Spring', 'JP1', 'HULFT8', 'AWK'],
                    industry: '金融'
                },
                {
                    name: '施設予約の地図パーツ作成',
                    description: 'はじめてメインで任されたプロジェクトです。好きなフレームワークを選んで良いということで、Meteor&MongoDBで開発しました。',
                    period: '',
                    techs: ['HTML', 'CSS', 'Meteor', 'MongoDB', 'JavaScript', 'Google Maps API'],
                    industry: '観光'
                },
                {
                    name: '観光データの収集',
                    description: 'スクレイピングやWebAPIを用いてデータの収集・加工などデータ管理を行いました。',
                    period: '',
                    techs: ['HTML', 'CSS', 'PHP', 'JavaScript', 'MySQL', 'Virtuoso'],
                    industry: '観光'
                },
                {
                    name: '観光関連のWEBサービスの開発・運用・保守',
                    description: 'ルート案内サービスや地域SNSなど20以上のサービスに係ることができました。',
                    period: '',
                    techs: ['HTML', 'CSS', 'PHP', 'Xoops', 'JavaScript', 'JQuery', 'Angular', 'Ruby on Rails', 'Vue', 'MySQL', 'Docker', 'Apache', 'Google App Engine', 'Google App Script', 'Zabbix', 'GitHub', 'GitLab', 'Google Stackdriver'],
                    industry: '観光'
                }
            ]
        },
        {
            name: '会社A',
            period: '',
            position: 'フルスタックエンジニア',
            projects: [
                {
                    name: '居酒屋の顧客管理システムの開発',
                    description: 'Microsoft Accessを使って設計済みのシステムを作成しました。',
                    period: '',
                    techs: ['Access', 'VBA'],
                    industry: '飲食'
                },
                {
                    name: 'サーバの運用',
                    description: 'メールアカウントの追加やWEBサービスの公開などを行いました。',
                    period: '',
                    techs: ['Linux', 'Postfix', 'CentOS', 'Apache'],
                    industry: 'IT・インフラ'
                }
            ]
        },
        {
            name: '大学',
            period: '',
            projects: [
                {
                    name: 'プログラミング教材の開発',
                    description: 'Prosseingで「Scratch」のような教材を開発し、実際にデモ授業を実施しました。',
                    period: '',
                    techs: ['Prosseing'],
                    industry: '教育'
                },
                {
                    name: '青森の街並みをデジタルで再現',
                    description: '青森市の街並みを3Dで再現するため、画像の作成やモデリングを行いました。',
                    period: '',
                    techs: ['Google SketchUp', 'Gimp', 'Inkscape', 'Hugin'],
                    industry: '教育'
                }
            ]
        }
    ]

    return { careers }
}
