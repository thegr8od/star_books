pipeline {
    agent any
    triggers {
        gitlab(triggerOnPush: true, triggerOnMergeRequest: true)
    }
    environment {
        MATTERMOST_WEBHOOK = credentails('MERGE_MESSEGE_URL')
    }
    stages {
        stage('Notify Merge Request') {
            steps {
                script {
                    echo "빌드 시작됨..."
                    
                    try {
                        def mergeRequestState = env.gitlabMergeRequestState ?: "UNKNOWN"
                        def mergeRequestUrl = credentails('URL')

                        if (mergeRequestState == 'opened') {
                            def message = """
🔔 **새로운 Merge Request가 생성되었습니다!**
🔀 **브랜치**: `${env.gitlabSourceBranch} → ${env.gitlabTargetBranch}`
👤 **작성자**: ${env.gitlabUserName}
📎 **[Merge Request 바로가기](${mergeRequestUrl})**
✅ 리뷰 후 승인 부탁드립니다!
                            """
                            echo "Mattermost 알림 전송 중..."
                            sh """
                            curl -X POST -H 'Content-Type: application/json' \
                            --data '{"text": "${message}"}' ${MATTERMOST_WEBHOOK}
                            """
                        } 
                    } catch (Exception e) {
                        echo "⚠️ 예외 발생: ${e.getMessage()}"
                    } finally {
                        // Webhook이 항상 HTTP 200을 반환하도록 보장
                        sh "curl -X POST -H 'Content-Type: application/json' --data '{\"status\":\"ok\"}' ${MATTERMOST_WEBHOOK}"
                    }
                }
            }
        }
    }
    post {
        always {
            echo "빌드 완료됨!"
        }
    }
}