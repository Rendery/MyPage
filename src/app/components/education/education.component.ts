import { Component } from '@angular/core';

interface Course {
  title: string;
  institution: string;
  date: string;
  credential: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {
  courses: Course[] = [
    { title: "Arduino y algunas aplicaciones", institution: "Universidad Nacional Autónoma de México", date: "jun. 2024", credential: "4NUPA7MY7PZM" },
    { title: "Incident Response and Digital Forensics", institution: "IBM", date: "jun. 2024", credential: "NVBDKHYCQHS2" },
    { title: "An Introduction to Accessibility and Inclusive Design", institution: "University of Illinois Urbana-Champaign", date: "may. 2024", credential: "9B38857XJRYT" },
    { title: "Combining Scrum with Other Agile Methodologies", institution: "LearnQuest", date: "may. 2024", credential: "MMAU8YV4FGKC" },
    { title: "Computer Networks and Network Security", institution: "IBM", date: "may. 2024", credential: "HS9MMBR8P8WH" },
    { title: "Cybersecurity Assessment: CompTIA Security+ & CYSA+", institution: "IBM", date: "may. 2024", credential: "VUYDYMBADGEM" },
    { title: "Cybersecurity Compliance Framework, Standards & Regulations", institution: "IBM", date: "may. 2024", credential: "V7HCRZ43859F" },
    { title: "Introduction to Cybersecurity Tools & Cyberattacks", institution: "IBM", date: "may. 2024", credential: "J9VLRV7DMM8W" },
    { title: "Introduction to Scrum Master Training", institution: "LearnQuest", date: "may. 2024", credential: "RW4XRTVGH8DY" },
    { title: "Operating Systems: Overview, Administration, and Security", institution: "IBM", date: "may. 2024", credential: "ZDP636T5BD9K" },
    { title: "Penetration Testing, Threat Hunting, and Cryptography", institution: "IBM", date: "may. 2024", credential: "98ELK26DVLZD" },
    { title: "Scrum Master Certification: Scaling Agile and the Team-of-Teams", institution: "LearnQuest", date: "may. 2024", credential: "TMFPYLJ6HH6M" },
    { title: "Scrum Master Certification: Scrum Methodologies", institution: "LearnQuest", date: "may. 2024", credential: "2F72H7UMFCUC" },
    { title: "¡A Programar! Una introducción a la programación", institution: "The University of Edinburgh", date: "may. 2024", credential: "KNFNXYDHNHAT" },
    { title: "¿Cómo (nos) cambia la Tecnología?", institution: "Universidad de Chile", date: "may. 2024", credential: "4N46F5NR7G84" },
    { title: "Aspectos básicos de la asistencia técnica", institution: "Crece con Google", date: "oct. 2023", credential: "5JBAFZGKTDCC" },
    { title: "Los bits y bytes de las redes informáticas", institution: "Crece con Google", date: "oct. 2023", credential: "2GSVWR6GMJKB" },
    { title: "Sistemas operativos y tú: Convertirse en un usuario avanzado", institution: "Crece con Google", date: "oct. 2023", credential: "A4HHP9GQLGSB" },
    { title: "Art and Science of Machine Learning en Español", institution: "Google Cloud", date: "may. 2023", credential: "TUPQ6PK3BJLE" },
    { title: "Feature Engineering en Español", institution: "Google Cloud", date: "may. 2023", credential: "VMB285T5BMJF" },
    { title: "How Google does Machine Learning en Español", institution: "Google Cloud", date: "may. 2023", credential: "X7R9EQWE75FD" },
    { title: "Intro to TensorFlow en Español", institution: "Google Cloud", date: "may. 2023", credential: "PQ7VKFVU2ZW2" },
    { title: "Launching into Machine Learning en Español", institution: "Google Cloud", date: "may. 2023", credential: "2ZEWK5KYRUY3" },
    { title: "Introduction to Programming with MATLAB", institution: "Vanderbilt University", date: "jun. 2022", credential: "KZDP7J4CMADP" },
    { title: "Capstone: Retrieving, Processing, and Visualizing Data with Python", institution: "University of Michigan", date: "nov. 2021", credential: "PNAE4MEE92T3" },
    { title: "Using Databases with Python", institution: "University of Michigan", date: "nov. 2021", credential: "FUPJSAXLR9FB" },
    { title: "Using Python to Access Web Data", institution: "University of Michigan", date: "oct. 2021", credential: "9KX6LQSPNYMT" },
    { title: "Python Data Structures", institution: "University of Michigan", date: "sept. 2021", credential: "69GTUL9UVVSB" },
    { title: "Programming for Everybody (Getting Started with Python)", institution: "University of Michigan", date: "ago. 2021", credential: "8BQV924CKDJ3" }
  ];
}