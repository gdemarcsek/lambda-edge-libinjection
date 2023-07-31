FROM --platform=linux/x86_64 public.ecr.aws/lambda/nodejs:18.2023.07.19.03

RUN yum update -yy && yum install -yy python3 gcc make binutils g++ gcc-c++
COPY . ${LAMBDA_TASK_ROOT}
WORKDIR ${LAMBDA_TASK_ROOT}
RUN npm install

FROM --platform=linux/x86_64 public.ecr.aws/lambda/nodejs:18.2023.07.19.03
COPY --from=0 ${LAMBDA_TASK_ROOT} ${LAMBDA_TASK_ROOT}
CMD ["index.handler"]
