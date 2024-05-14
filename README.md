https://github.com/kim365my/Obsidian-dataviewjs-template-table

위의 레포를 플러그인으로 변환하였습니다

# 예시 코드

```page-table
"pages": "#독서",
"rows" : ["cover_url", "file.link", "author", "created", "tags", "book_note"],
"filter" : [
	{
		"label" : "완독서",
		"type": "property",
		"target": "status",
		"target_content": "true"
	},
	{
		"label" : "읽고 있는 책",
		"type": "property",
		"target": "status",
		"target_content": "false"
	},
	{
		"label" : "eBook만",
		"class": "도서분류",
		"type": "property",
		"target": "category",
		"target_content": "eBook"
	},
	{
		"label" : "영어공부만",
		"class": "도서분류",
		"type": "property",
		"target": "genre",
		"target_content": "영어"
	},
	{
		"label" : "프로그래밍만",
		"class": "도서분류",
		"type": "tags",
		"target": "프로그래밍",
		"target_isInclude": "true"
	},
	{
		"label" : "올해의 독서",
		"class": "기간",
		"type": "property",
		"target": "created",
		"target_content": "2024-01-01 ~ now"
	}
],
"sort" : [
	{
		"label": "완독일순 (최신순)",
		"type": "finish_read_date",
		"sort": "desc"
	},
	{
		"label": "완독일순 (오래된순)",
		"type": "finish_read_date",
		"sort": "asc"
	}
]
```
