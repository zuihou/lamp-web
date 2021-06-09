#!groovy
pipeline {
    agent any

    environment {
        // jenkins 上动态配置的参数
        // SERVER_SSH_HOST: 推送到那台服务器

        // 根据项目或部署服务器 可能需要更改一次的变量
        // jar名
        JAR_NAME = "lamp-web"

        // 以下变量基本不变
        // 推送到服务器端的文件夹路径
        remoteDirectory = "./temp_jar/"

        // 推送时需要忽略的项目前缀
        removePrefix = ""

        // 需要推送到服务器端的文件(jar)
        sourceFiles = "${JAR_NAME}.tgz"
    }

    stages {
        stage('替换环境参数') {
            steps {
                script {
                    PROFILES_ARR = "${SERVER_SSH_HOST}".split('_')
					PROFILES = PROFILES_ARR[1]

					WORKSPACE_HOME = "/data_${PROFILES}"

                    // 服务端执行的脚本
                    EXEC_COMMAND = "bash -x -s < ${WORKSPACE_HOME}/bin/server_node_run.sh ${JAR_NAME} ${PROFILES}"

                    echo "您选择了如下参数："
                    echo "拉取分支： ${branch}, 是否执行npm install:  ${IS_INSTALL}, 打包环境：${PROFILES}, 推送至：${SERVER_SSH_HOST}"
                }
            }
        }

        stage('npm 构建') {
            steps {
                script {
                    echo "是否执行npm install:  ${IS_INSTALL}"
                    if("${IS_INSTALL}" == "true") {
                        sh "npm install"
                    }
                }
                sh "npm run build:${PROFILES}"
            }
        }

        stage('压缩') {
            steps {
                sh "tar -zcvf ${JAR_NAME}.tgz ${JAR_NAME}"
            }
        }

        stage('推送jar&执行动作') {
            steps {
                sshPublisher(publishers: [sshPublisherDesc(configName: "${SERVER_SSH_HOST}", transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: "${EXEC_COMMAND}", execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "${remoteDirectory}", remoteDirectorySDF: false, removePrefix: "", sourceFiles: "${sourceFiles}")], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
            }
        }
    }

}


