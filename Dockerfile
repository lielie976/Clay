FROM ccr.ccs.tencentyun.com/dhub.wallstcn.com/clay:base
WORKDIR /usr/src/app/
ADD . /usr/src/app/
ADD public/dist  /usr/src/app/dist

# init nginx
RUN cp -R nginx/* /etc/nginx/
RUN mkdir -p /data/nginx/cache

# 东八区时区设置
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 东八区时区设置
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

ADD entrypoint.sh /usr/src/app/
RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
