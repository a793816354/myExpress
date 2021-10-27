const func1 = (ctx, next) => {
    console.log(1);
    next()
    // return next()
}

const func2 = (ctx, next) => {
    console.log(2);
    next()
}


const func3 = (ctx, next) => {
    console.log(3);
    ctx.body = {
        ec: 200,
        em: true
    }
}

const func4 = (ctx, next) => {
    console.log(4);
    next()
}

const funcArr = [func1, func2, func3, func4]
const iter = funcArr[Symbol.iterator]()

const ctx = {}

const initCtx = () => {
    ctx.done = true
    ctx.value = null
}

Reflect.defineProperty(ctx, 'body', {
    set(val) {
        console.log(val);
        initCtx()
    }
})


const nextFunc = () => {
    const { done, value } = iter.next()
    ctx.done = done
    ctx.value = value
}

nextFunc()
while (!ctx.done && typeof ctx.value === 'function') {
    const { value } = ctx
    initCtx()
    value(ctx, nextFunc)

}
