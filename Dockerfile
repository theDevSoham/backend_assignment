FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# building code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 8080

ENV JWT_KEY=dGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw== \
	MONGO_PASSWORD=FhEs4KmiZEXYdHQy \
	MONGO_URL=mongodb+srv://Sohamxyz:FhEs4KmiZEXYdHQy@mycluster.wm5k97v.mongodb.net/?retryWrites=true&w=majority

#Dev server
CMD [ "npm", "start" ]

#For testing
#CMD [ "npm", "run", "test" ]