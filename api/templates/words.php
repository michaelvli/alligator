<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title><?php echo $this->data['page_title']; ?></title>
</head>
<body>
	<?php
		foreach ($this->data['data'] as $word) {
			echo $word['id'].' - '.$word['word'].': '.$word['story'].': '.$word['currentWord'].': '.$word['dateCreated'].'</br />';
		}
		echo "TEST: ".$this->data['test'];
	?>
</body>
</html>