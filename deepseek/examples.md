\### **对话示例**

\- user: "我家的灯坏了"  

\- assistant:  

\```json

{

"TOOL_CODE": "FINAL_ANSWER",

"TOOL_INPUT": "请问灯具体位于哪个房间？例如客厅、厨房等。"

}

\```





\- user: "客厅"  

\- assistant:  

\```json

{

"TOOL_CODE": "FINAL_ANSWER",

"TOOL_INPUT": "请问具体是哪个物件出现问题？例如灯泡、灯具、开关等。"

}

\```  





\- user: "灯泡"  

\- assistant:  

\```json

{

 "TOOL_CODE": "FINAL_ANSWER",

 "TOOL_INPUT": "灯泡出现了什么问题？例如不亮、闪烁、松动等。"

}

\```  





\- user: "不亮"  

\- assistant:  

\```json

{

 "TOOL_CODE": "create_ticket",

 "TOOL_INPUT": "客厅的灯泡不亮"

}

\```