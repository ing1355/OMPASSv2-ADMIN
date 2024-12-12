# OMPASS 프록시

## 개요
OMPASS 프록시는 LDAP 사용자 동기화 및 RADIUS 2차 인증을 위한 프록시 서버입니다.
* RADIUS 인증을 사용하는 VPN 또는 다른 기기와 OMPASS를 통합하려면 네트워크 내의 머신에 로컬 프록시를 설치해야 합니다.
* OMPASS Portal 에서 LDAP 을 사용하여 다수의 사용자 등록을 진행하거나 RADIUS 의 사용자 등록을 진행하기 위해서는 OMPASS 프록시를 설치해야합니다.

   >   <h4>연결 요구 사항</h4></br>
   >이 어플리케이션은 SSL TCP 포트 443에서 Ompass 서비스와 통신합니다.</br></br>
   >목적지 IP 주소 또는 IP 주소 범위를 사용하는 규칙으로 Ompass 서비스에 대한 아웃바운드 엑세스를 제한하는 방화벽 구성은 권장되지 않습니다.</br></br>
   >TLS 1.0 또는 1.1 연결이나 안전하지 않은 TLS/SSL 암호화 모음을 지원하지 않습니다.

    

## 사전 작업
1. 기존에 사용중인 LDAP 서버 또는 RADIUS 서버가 운영중에 있어야합니다.



## OMPASS 프록시 설치
* Ompass 인증 프록시는 물리적 또는 가상 호스트에 설치할 수 있습니다. 최소 1개의 CPU, 200MB 디스크 공간, 4GB RAM이 있는 시스템을 권장합니다.
* Active Directory 도메인 컨트롤러 역할을 하는 동일한 Windows 서버나 네트워크 정책 서버(NPS) 역할이 있는 서버에 Ompass 프록시를 설치하는 것은 권장하지 않습니다. Ompass 프록시를 이러한 서비스와 함께 배치해야 하는 경우 Ompass 서비스와 기존 서비스 간의 잠재적인 LDAP 또는 RADIUS 포트 충돌을 해결할 준비를 해주세요.


1. **OMPASS Portal** 에서 설치파일을 다운로드합니다. (ompass_proxy.zip)
2. 압축 해제 후 설정파일을 수정합니다. (중요)  
   `$ sudo vi config.properties`
   ```properties
   ### PROXY SERVER PORT
   server.port=9999
   
   ### LDAP SYNC
   ldap.sync.enable=false
   ldap.sync.partitionSuffix=dc=example,dc=com
   ldap.sync.principal=cn=admin,dc=example,dc=com
   ldap.sync.password=test
   ldap.sync.port=389
   ldap.sync.url=ldap://192.168.182.75

   ldap.sync.ompass.secret-key=1929dfa5ea5566df5d0713164baef4d76eeaa04d750658a523bf314f5b1ffdda
   ldap.sync.ompass.interface-origin=https://www.ompass.kr:54007

   ### RADIUS
   radius.ompass.client-id=b162251f-8750-47ae-b05f-9be4d2a3853e
   radius.ompass.secret-key=997d2123f51a816f594f4e5821e2200e4d7276616ce4eb962750c8c1ea7f22b0
   radius.ompass.interface.address=ompass.kr
   radius.ompass.interface.api-port=54007
   radius.ompass.interface.tcp-socket-port=58092

   radius.proxy.access-port=1812
   radius.proxy.account-port=1813
   radius.proxy.secret=test

   radius.origin.address=192.168.182.140
   radius.origin.access-port=1812
   radius.origin.account-port=1813
   radius.origin.secret=test
   ```

   ### 프록시 서버 포트 설정 (필수)

      | 항목 이름                                 | 설명                                                         |
      |------------------------------------------|------------------------------------------------------------|
      | `server.port`                       | 프록시 서버의 포트를 설정합니다.         |

   ### LDAP 설정
   OMPASS 프록시가 기존에 운영중인 LDAP 에 연결하기 위한 설정 정보입니다. </br></br>
            참고사항
      > RADIUS 인증을 사용하지 않고 LDAP 사용자 동기화만 진행한다면 RADIUS 설정파일은 수정하지 않아도 됩니다.
   

   | 항목 이름                                 | 설명                                                         |
   |------------------------------------------|------------------------------------------------------------|
   | `ldap.sync.enable`                       | LDAP 동기화 기능을 활성화 또는 비활성화하는 설정입니다. (LDAP 동기화를 진행하려면 true 변경)         |
   | `ldap.sync.partitionSuffix`              | LDAP 동기화에서 사용할 파티션 접미사를 설정합니다.           |
   | `ldap.sync.principal`                    | LDAP 서버에 연결할 때 사용할 관리자의 DN (Distinguished Name). |
   | `ldap.sync.password`                     | LDAP 서버에 연결할 때 사용할 관리자의 비밀번호입니다.          |
   | `ldap.sync.port`                         | LDAP 서버의 포트 번호를 설정합니다. 기본적으로 389입니다.     |
   | `ldap.sync.url`                          | LDAP 서버의 URL을 설정합니다.                                  |
   | `ldap.sync.ompass.secret-key`            | OMPASS Portal LDAP 설정 상세 정보의 시크릿 키를 입력하세요.                        |
   | `ldap.sync.ompass.interface-origin`      | OMPASS Portal LDAP 설정 상세 정보의 API 서버 주소를 입력하세요.                     |

   ### RADIUS 설정
   OMPASS Portal 의 RADIUS 어플리케이션 상세 정보를 참고하세요.  </br></br>
            참고사항
      > OMPASS RADIUS 2차 인증을 사용하기 위해서는 LDAP 설정 정보 입력이 필수입니다.

   | 항목 이름                                 | 설명                                                         |
   |------------------------------------------|------------------------------------------------------------|
   | `radius.ompass.client-id`                | RADIUS 어플리케이션의 클라이언트 ID를 설정합니다.                      |
   | `radius.ompass.secret-key`               | RADIUS 어플리케이션의 비밀키를 설정합니다.                           |
   | `radius.ompass.interface.address`        | RADIUS 어플리케이션의 인터페이스의 주소를 설정합니다.                  |
   | `radius.ompass.interface.api-port`       | RADIUS Ompass 인터페이스의 API 포트를 설정합니다.              |
   | `radius.ompass.interface.tcp-socket-port`| RADIUS Ompass 인터페이스의 TCP 소켓 포트를 설정합니다.         |
   | `radius.proxy.access-port`               | OMPASS RADIUS 프록시의 액세스 포트를 설정합니다.                      |
   | `radius.proxy.account-port`              | OMPASS RADIUS 프록시의 계정 포트를 설정합니다.                        |
   | `radius.proxy.secret`                    | OMPASS RADIUS 프록시의 비밀 키를 설정합니다.                           |
   | `radius.origin.address`                  | RADIUS 원본 서버의 주소를 설정합니다.                         |
   | `radius.origin.access-port`              | RADIUS 원본 서버의 액세스 포트를 설정합니다.                   |
   | `radius.origin.account-port`             | RADIUS 원본 서버의 계정 포트를 설정합니다.                     |  
   | `radius.origin.secret`                   | OMPASS RADIUS 프록시와 기존 RADIUS 서버 간에 공유할 비밀입니다. (기존 RADIUS 에서 설정한 값과 같이 변경해주세요)    |  

  

3. **install.sh** 스크립트를 실행합니다. </br>
   `$ sudo ./install.sh`


3. Ompass 프록시가 잘 실행되었는 지 확인합니다. </br>
   `$ sudo systemctl status ompass_proxy`




