from bs4 import BeautifulSoup
import re


html_doc = open('dig.html')
outTxt = open("dig.txt","w")

soup = BeautifulSoup(html_doc, 'html.parser')

items = soup.find_all("div",class_ ="item")
# for item in items:
# 	name = item.find("div",class_ = "heading single-line ellipsis").div.string
	
# 	tmp = item.find("ul",class_ = "muted spec-abbr").find_all("div")
# 	cpu = tmp[0].string
# 	ram = tmp[1].string
# 	storage = tmp[2].string
	
# 	srp = str(item.find("span",class_ = "money line-through").string)
# 	index = srp.find(',')
# 	if(index != -1):
# 		srp = "".join(srp.split(","))

# 	price = str(item.find(string=re.compile("HK")).string).strip()
# 	price = price[price.find(" ")+1:]
# 	index = price.find(',')
# 	if(index != -1):
# 		price = "".join(price.split(","))
	
# 	print(name+","+cpu+","+ram+","+storage+","+srp+","+price)
# 	outTxt.write(name+","+cpu+","+ram+","+storage+","+srp+","+price+"\n")


###FOR iPAD
for item in items:
	name = item.find("small",class_ = "text-brandcolor").string
	
	tmp = item.find("ul",class_ = "muted spec-abbr").find_all("div")
	# cpu = tmp[0].string
	# ram = tmp[1].string
	storage = tmp[2].string
	
	srp = str(item.find("span",class_ = "money line-through").string)
	index = srp.find(',')
	if(index != -1):
		srp = "".join(srp.split(","))

	price = str(item.find(string=re.compile("HK")).string).strip()
	price = price[price.find(" ")+1:]
	index = price.find(',')
	if(index != -1):
		price = "".join(price.split(","))
	
	print(name+","+storage+","+srp+","+price)
	outTxt.write(name+","+storage+","+srp+","+price+"\n")
	