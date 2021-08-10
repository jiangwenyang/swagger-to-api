---
to: src/api<%= basePath %>.js
inject: true
append: true
skip_if: <%= method + h.changeCase.pascal(path) %>
---

// <%= summary %>
<% requstBodyMethodList=["post",'put'] -%>
<% methodMap={delete:"del"} -%>
export const <%= method + h.changeCase.pascal(path) %> = <%= requstBodyMethodList.includes(method) ? "data" : "params" %> => {
  return <%= methodMap[method] || method %>(genPath(basePath, '<%= path %>'), <%= requstBodyMethodList.includes(method) ? "data" : "{ params }" %>)
}
