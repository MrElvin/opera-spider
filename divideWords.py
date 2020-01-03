# 导入所需要的包
# 其中 bs4, jieba, wordcloud, numpy, PIL 需要额外安装
import codecs
import jieba
import jieba.analyse
from wordcloud import WordCloud
import numpy as np
from PIL import Image

# 利用 TFIDF 或 TextRank 算法从 tex 中提取关键词
def get_keyword(text, mode, topK=20):
  if mode == "tfidf":
    return jieba.analyse.extract_tags(text, topK=topK, withWeight=False, allowPOS=('n', 'nz', 'vn', 'v'))
  elif mode == "textrank":
    return jieba.analyse.textrank(text, topK=topK, withWeight=False, allowPOS=('n', 'nz', 'vn', 'v'))

# 上面全部是函数的定义
# 从这一行开始往下,是主流程
file = codecs.open('military.txt','r','utf-8')
lines = [line.strip() for line in file]
file.close()

# 从 texts 中获取关键词
# keywords = get_keyword("\n".join(lines), "textrank",topK=20)
# keywords = get_keyword("\n".join(lines), "tfidf", topK=40)
# print(keywords)

keywords2 = get_keyword("\n".join(lines), "textrank", topK=200)
print(keywords2)

# 读取掩码图像
mask = np.array(Image.open("raw2.png"))
# 设置词云属性
wc = WordCloud(font_path="simsun.ttc", mask=mask, background_color="white")
# 根据关键词生成词云
wc.generate(" ".join(keywords2))
# 将词云保存为本地图片
wc.to_image().save("wordCloud.jpg")

