FROM registry.cn-beijing.aliyuncs.com/jianos/node
RUN mkdir -p /data/sourcemap
ADD . /data/sourcemap
WORKDIR /data/sourcemap
RUN yarn install
ENTRYPOINT ["node", "/data/sourcemap/sourcemap.js"]

