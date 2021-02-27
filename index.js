const express = require('express');
const app = express();

// Data
const { courses } = require('./data.json');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    course(id: Int!): Course
    courses(topic: String): [Course]
  }
  type Mutation {
    updateCourseTopic(id: Int!, topic: String!): Course
  }
  type Course {
    id: Int
    title: String
    author: String
    topic: String
    url: String
  }
`);

const getCourse = (args) => {
  const id = args.id;
  return courses.find(course => course.id === id);
}

const getCourses = (args) => {
  if (!args.topic) return courses;
  const topic = args.topic;
  return courses.filter(course => course.topic === topic);
}

const updateCourseTopic = ({ id, topic }) => {
  courses.map((course) => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  });
  return courses.find((course) => course.id === id)
}

const root = {
  course: getCourse,
  courses: getCourses, 
  updateCourseTopic: updateCourseTopic,
}

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

app.listen(3000, () => console.log('Server on port 3000 '))