const { bankRecognition } = require('../baidu_ocr')

module.exports = async ctx => {

    // 获取上传之后的结果
    const data = await bankRecognition(ctx)

    ctx.state.data = {} && data.ocrResult
}
