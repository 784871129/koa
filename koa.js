const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const axios=require('axios')
const https=require('https')
const agent = new https.Agent({  
  rejectUnauthorized: false
});
const app = new Koa();
const clientID='d918917058a90dea8772';
const clientSecret='c7c19b3dfc8ca35524e18295ef3c992e2b190932'
//中间件
app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    if (ctx.method == 'OPTIONS') {
      ctx.body = 200; 
    } else {
      await next();
    }
  })

app.use(async (ctx,next)=>{
    await next();
    ctx.response.type='application/json'
    const matches=ctx.url.match(/\/\?code\=.*/);
    const code=matches[0].slice(7)
    console.log('code',code,'requiring token...')
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = false
    const token=await axios.get(`https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,{ httpsAgent: agent })
    ctx.response.body=token
    console.log(ctx);
})
app.use(async (ctx,next)=>{
    console.log('收到请求');
    await next();
    
})
app.use(async (ctx,next)=>{
    let date=new Date();
    console.log(date,ctx.request.method,ctx.request.url); 
})
//
app.listen(3001);
console.log('listening at port 3001...');
