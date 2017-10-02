git clone https://github.com/maputnik/editor.git temp
cd temp
npm install
npm run build
mkdir ../public
cp -R public/* ../public
