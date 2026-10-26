CREATE DATABASE livros_emprestimos;
USE livros_emprestimos;

CREATE TABLE usuarios(
  id INT AUTO_INCREMENT,
  nome VARCHAR(30),
  PRIMARY KEY(id)
);

CREATE TABLE livros(
  id INT AUTO_INCREMENT,
  nome VARCHAR(30),
  PRIMARY KEY(id)
);

CREATE TABLE emprestimos(
  id INT AUTO_INCREMENT,
  id_usuario INT, 
  id_livro INT,
  PRIMARY KEY(id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_livro) REFERENCES livros(id)
);
