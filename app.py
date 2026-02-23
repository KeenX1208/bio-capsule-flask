from flask import Flask, render_template

app = Flask(__name__)

# 首页路由
@app.route('/')
@app.route('/index.html')
def home():
    return render_template('index.html')

# 动态路由：自动匹配所有 .html 结尾的请求
@app.route('/<page_name>.html')
def render_page(page_name):
    try:
        # 尝试渲染对应的模板
        return render_template(f'{page_name}.html')
    except:
        # 如果找不到文件，默认跳回首页 (防报错机制)
        return render_template('index.html')

if __name__ == '__main__':
    # 开启 debug 模式，本地运行测试
    app.run(debug=True)