pipeline {
  agent any

  stages {

    stage('Clone Repo') {
      steps {
        git branch: 'main',
            url: 'https://github.com/charan2r/hyper-play.git'
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'docker build -t hyper-backend .'
        }
      }
    }

    stage('Build Frontend User') {
      steps {
        dir('frontend') {
          sh 'docker build -t hyper-frontend .'
        }
      }
    }

    stage('Build Frontend Admin') {
      steps {
        dir('admin') {
          sh 'docker build -t hyper-admin .'
        }
      }
    }

    stage('Deploy Containers') {
      steps {
        sh '''
          docker stop backend frontend admin || true
          docker rm backend frontend admin || true
          docker network create app-network || true

          docker run -d --name backend \
            --network app-network \
            -p 5000:5000 \
            --env-file /opt/env/backend.env \
            hyper-backend

          docker run -d --name frontend \
            --network app-network \
            -p 5173:80 \
            hyper-frontend

          docker run -d --name admin \
            --network app-network \
            -p 5174:80 \
            hyper-admin
        '''
      }
    }
  }
}
