
//TABLICA
const exampleUsers: String[] = [];


//TYP
type User = {
    id: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'devops' | 'developer';
};

//TABLICA TYPÓW
const Users: User[] = [
    {id: '1', firstName:'Jakub', lastName:'Kowalski', role:'admin'},
    {id: '2', firstName:'Krystian', lastName:'Kwiatkowski', role: 'developer'},
]

const developers = Users.filter(user => user.role === 'developer');
console.log('Developerzy:', developers);
