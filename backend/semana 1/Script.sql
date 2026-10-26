CREATE DATABASE livros_emprestimos;
USE livros_emprestimos;

CREATE TABLE usuarios(
  id INT AUTO_INCREMENT,
  nome VARCHAR(30) NOT NULL,
  tag VARCHAR(30) UNIQUE NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE livros(
  id INT AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  autor VARCHAR(50) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE emprestimos(
  id INT AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_livro INT NOT NULL,
  data_emprestimo DATE NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_livro) REFERENCES livros(id)
);
