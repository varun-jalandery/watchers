rsync -azP \
                --exclude=node_modules \
                --exclude=.git \
                --exclude=.gitignore \
                --exclude=.idea \
                --exclude=.gitmodules \
                --exclude=package-lock.json \
                --exclude=mobile_staging.json \
                --exclude=apps_staging.json \
                ~/current/ varun@dev.circles.asia:/home/varun/current

# osascript -e 'tell app "System Events" to display dialog "Code deployed on tomalak."'
