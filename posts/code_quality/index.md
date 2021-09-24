Code quality
============

	# THE DEFINITIVE CODE QUALITY CHECKER
	# NOTE: replace /^C  / and '\.c' with whatever language
	loc=$(cloc --output-type sloccount . | awk '/^C  / {print $5}')
	ifs=$(cat $(find . -type f | grep '\.c') | grep -c '\bif\b')
	
	score=$(expr $loc / $ifs)
	printf 'score=%s ' $score
	
	case $score in
		0|1|2)
			echo put in bin
			;;
		3|4)
			echo needs improvement
			;;
		5|6)
			echo average
			;;
		7|8|9)
			echo good
			;;
		*)
			echo great
			;;
	esac
